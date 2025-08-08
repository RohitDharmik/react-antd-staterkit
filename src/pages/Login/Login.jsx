import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { Form, Input, Button, Switch, Typography, Checkbox, theme } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import gsapAnimations from "../../utils/gsapAnimations";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    setError,
    clearErrors,
    watch,
  } = useForm({ defaultValues: { email: "", password: "", remember: true } });
  const { login } = useAuth();

  // drive button disabled state using RHF watch (no extra state)
  const emailValue = watch("email");
  const passwordValue = watch("password");
useEffect(() => {
   console.log("Email or password changed", { emailValue, passwordValue });
   
}, [passwordValue,emailValue])


  const [useBiometric, setUseBiometric] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = theme.useToken();
  const accent = "var(--accent, #00e5ff)";
  const accentMix = (percent, fallback = "#00e5ff") =>
    `color-mix(in oklab, var(--accent, ${fallback}) ${percent}%, transparent)`;

  const bootRef = useRef(null);
  const avatarRef = useRef(null);
  const blinkRef = useRef(null);

  useEffect(() => {
    // Accessibility: focus email first
    setFocus("email");

    // Detect WebAuthn availability (platform auth)
    const available = !!(
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable === "function"
    );
    if (available) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((ok) => setBioAvailable(!!ok))
        .catch(() => setBioAvailable(false));
    }

    // Boot sequence animation when component mounts
    const boot = bootRef.current;
    if (boot) {
      boot.style.opacity = 0;
      setTimeout(() => {
        boot.innerText = "Initializing Command Core…";
        boot.style.opacity = 1;
        setTimeout(() => {
          boot.innerText = "Linking Neural Interfaces…";
        }, 700);
        setTimeout(() => {
          boot.innerText = "Securing Channels…";
        }, 1400);
        setTimeout(() => {
          boot.style.opacity = 0;
        }, 2100);
      }, 150);
    }
    // Floating avatar idle breathing
    if (avatarRef.current) {
      gsapAnimations.float(avatarRef.current, { y: 10, duration: 3.2 });
    }
    // Subtle blink/pulse on biometric badge
    if (blinkRef.current) {
      gsapAnimations.float(blinkRef.current, { y: 4, duration: 2.2 });
    }
  }, [setFocus]);

  const simulateWebAuthn = async () => {
    // Placeholder for real WebAuthn. Here we simulate a brief check.
    return new Promise((resolve) => setTimeout(resolve, 700));
  };

  const onSubmit = async (data) => {
    try {
      // Simulate biometric path if enabled
      if (useBiometric) {
        if (bootRef.current) {
          bootRef.current.style.opacity = 1;
          bootRef.current.innerText = "Verifying Biometric Signature…";
        }
        await simulateWebAuthn();
        if (bootRef.current) bootRef.current.style.opacity = 0;
      }

      const user = await login(data);
      Swal.fire({
        title: "Success!",
        text: "AI core authenticated — booting dashboard",
        icon: "success",
        confirmButtonText: "Proceed",
      }).then(() => {
        window.location.href = "/dashboard";
      });
    } catch (err) {
      // reflect error into form and SweetAlert
      setError("root.serverError", { type: "server", message: "Invalid email or password" });
      Swal.fire({
        title: "Error",
        text: err?.message || "Invalid credentials",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  // Live validation feedback: clear submit errors on input change
  useEffect(() => {
    if (errors.root?.serverError && (emailValue || passwordValue)) {
      clearErrors("root.serverError");
    }
  }, [emailValue, passwordValue, errors?.root, clearErrors]);


  // Remove local mirror state usage — RHF watch is sufficient




  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 md:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8 items-center w-full max-w-5xl">
        {/* Hologram avatar */}
        <div className="relative hidden md:block">
          <div
            ref={avatarRef}
            className="mx-auto w-48 h-48 rounded-full border"
            style={{
              borderColor: accentMix(42),
              background: `linear-gradient(180deg, ${accentMix(
                24
              )}, rgba(157, 36, 175, 1))`,
              boxShadow: `0 0 40px ${accentMix(28)}`,
              maskImage:
                "radial-gradient(closest-side, rgba(15,23,42,1), rgba(0,0,0,0.1))",
            }}
            role="img"
            aria-label="Floating hologram avatar"
          />
          <div className="mt-4 text-center text-cyan-200/90">
            Hologram Avatar
          </div>
          {/* biometric badge */}
          <div
            ref={blinkRef}
            className="mt-2 text-center text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md border"
            style={{
              color: bioAvailable ? accentMix(85) : "#ffffffff",
              borderColor: bioAvailable
                ? accentMix(50)
                : "rgba(255,255,255,0.12)",
              background: bioAvailable
                ? accentMix(16)
                : "rgba(255,255,255,0.05)",
            }}
            title={
              bioAvailable
                ? "Platform authenticator available"
                : "Biometric authenticator unavailable"
            }
            aria-live="polite"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: bioAvailable ? accentMix(85) : "#94a3b8",
                boxShadow: bioAvailable ? `0 0 10px ${accentMix(60)}` : "none",
              }}
            />
            {bioAvailable ? "Biometric Ready" : "Biometric Unavailable"}
          </div>
        </div>

        {/* Form card */}
        <div
          className="glass-panel p-6 md:p-8 w-full hover-lift"
          style={{
            borderColor: accentMix(35),
            boxShadow: `0 10px 30px -12px rgba(0,0,0,0.6), 0 0 24px ${accentMix(
              22
            )}`,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
          }}
        >
          <div
            ref={bootRef}
            className="text-center text-xs text-cyan-200/90 mb-3 transition-opacity duration-400"
            aria-live="polite"
          />
          {errors.root?.serverError?.message && (
            <div className="text-center text-xs text-red-300 mb-2">
              {errors.root.serverError.message}
            </div>
          )}
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            requiredMark={false}
          >
            <div className="flex items-center justify-between mb-4">
              <Typography.Title
                level={3}
                className="!m-0 !text-xl md:!text-2xl"
                style={{
                  color: accentMix(85),
                  textShadow: `0 0 10px ${accentMix(22)}`,
                }}
              >
                Login to Command Core
              </Typography.Title>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Biometric</span>
                <Switch
                  checked={useBiometric}
                  onChange={(v) => setUseBiometric(v && bioAvailable)}
                  disabled={!bioAvailable}
                  aria-label="Toggle biometric login"
                  style={{
                    background:
                      useBiometric && bioAvailable ? accentMix(60) : undefined,
                  }}
                />
              </div>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Enter a valid email address" },
              ]}
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Input
                style={{
                  background: "rgba(2,6,23,0.35)",
                  borderColor: accentMix(28),
                  color: "#e2e8f0",
                }}
                {...register("email", {
                  required: "Please input your email!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email address",
                  },
                })}
                
                placeholder="you@example.com"
                size="large"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
            >
              <Input
                style={{
                  background: "rgba(2,6,23,0.35)",
                  borderColor: accentMix(28),
                  color: "#e2e8f0",
                }}
                {...register("password", {
                  required: "Please input your password!",
                })}
                placeholder="••••••••"
                size="large"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-slate-300 hover:text-cyan-300 transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeTwoTone twoToneColor="#00e5ff" />
                    )}
                  </button>
                }
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-2">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="!mb-0"
              >
                <Checkbox defaultChecked {...register("remember")}>
                  Remember me
                </Checkbox>
              </Form.Item>
              <a
                href="/forgot-password"
                className="text-xs hover:underline"
                style={{ color: accentMix(70) }}
              >
                Forgot password?
              </a>
            </div>

            <Form.Item className="!mb-3">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                disabled={!emailValue || !passwordValue || isSubmitting}
                loading={isSubmitting}
                style={{
                  background: `linear-gradient(135deg, ${accentMix(
                    65
                  )}, ${accentMix(45)})`,
                  borderColor: accentMix(65),
                  boxShadow: `0 0 18px ${accentMix(35)}`,
                }}
              >
                {isSubmitting ? "Authorizing…" : "Enter Command Core"}
              </Button>
            </Form.Item>

            <div className="relative my-4 text-center text-[11px] text-slate-400">
              <span
                className="px-2"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  borderRadius: 6,
                  color: accentMix(65),
                }}
              >
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                block
                icon={<GoogleOutlined />}
                disabled
                style={{
                  background: "rgba(2,6,23,0.35)",
                  borderColor: accentMix(22),
                  color: accentMix(70),
                }}
              >
                Google
              </Button>
              <Button
                block
                icon={<GithubOutlined />}
                disabled
                style={{
                  background: "rgba(2,6,23,0.35)",
                  borderColor: accentMix(22),
                  color: accentMix(70),
                }}
              >
                GitHub
              </Button>
            </div>

            {/* Hint row */}
            <div
              className="mt-3 text-[11px] flex items-center gap-2"
              style={{ color: accentMix(55) }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: accentMix(85),
                  boxShadow: `0 0 10px ${accentMix(70)}`,
                }}
              />
              {useBiometric
                ? "Biometric verification will be requested on submit."
                : "You can enable biometric for a faster, secure login."}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
