import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/auth/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/auth/Alert';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: '',
    fullName: '',
    phone: '',
    dob: '',
  });

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNextStep = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.confirm) {
      setAlert({ type: 'error', message: 'Please fill in your email and password.' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (form.password !== form.confirm) {
      setAlert({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setAlert(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) {
        setAlert({ type: 'error', message: error.message });
        return;
      }

      if (!data?.user) {
        setAlert({ type: 'error', message: 'Signup completed but no account was returned. Please try again.' });
        return;
      }

      setAuthUser(data.user);
      setAlert({ type: 'success', message: 'Account created. Please complete your profile.' });
      setStep(2);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Unable to create your account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.dob) {
      setAlert({ type: 'error', message: 'Please fill in your full name and date of birth.' });
      return;
    }

    if (!authUser?.id) {
      setAlert({ type: 'error', message: 'Your account session is not ready yet. Please try again.' });
      return;
    }

    const dobDate = new Date(form.dob);
    const today = new Date();
    if (Number.isNaN(dobDate.getTime()) || dobDate > today) {
      setAlert({ type: 'error', message: 'Date of birth must be a valid date in the past.' });
      return;
    }

    setAlert(null);
    setLoading(true);

    try {
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (existingProfileError) {
        throw existingProfileError;
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email ?? form.email.trim().toLowerCase(),
            full_name: form.fullName.trim(),
            phone: form.phone.trim(),
            dob: form.dob,
            role,
          });

        if (insertError) {
          throw insertError;
        }
      }

      setAlert({ type: 'success', message: 'Profile completed. Redirecting you in...' });
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (role === 'client') {
        navigate('/client/onboarding');
      } else {
        navigate('/freelancer/onboarding');
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Unable to create your profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading={step === 1 ? 'Create your account' : 'Complete your profile'}
      description="A managed talent network built for all creative professionals. Whether you are a designer, developer, or visual storyteller, Hadei provides a secure workspace built on trust and reliability."
      footerText="Already a member?"
      footerLinkLabel="Sign in"
      footerLinkTo="/auth/login"
    >
      <form onSubmit={step === 1 ? handleNextStep : handleSignup} className="space-y-3">
        <Alert type={alert?.type} message={alert?.message} />

        {step === 1 ? (
          <>
            <div className="flex gap-2 mb-2">
              {['client', 'freelancer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`w-full py-2 rounded-md border-2 font-black uppercase text-[10px] tracking-widest border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${role === r ? 'bg-[#F5F216] text-black' : 'bg-white text-black'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleFieldChange('email')}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleFieldChange('password')}
              />
              <Input
                label="Confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleFieldChange('confirm')}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading}>Continue</Button>
            </div>
          </>
        ) : (
          <>
            <Input
              label="Full Name"
              placeholder="Full name"
              value={form.fullName}
              onChange={handleFieldChange('fullName')}
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+91 PH_NO"
              value={form.phone}
              onChange={handleFieldChange('phone')}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={form.dob}
              onChange={handleFieldChange('dob')}
            />

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAlert(null);
                  setStep(1);
                }}
                disabled={loading}
                className="w-full py-3 rounded-md border-2 font-black uppercase text-[10px] tracking-widest border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white text-black disabled:opacity-60"
              >
                Back
              </button>
              <Button type="submit" loading={loading}>Create account</Button>
            </div>
          </>
        )}
      </form>
    </AuthLayout>
  );
}