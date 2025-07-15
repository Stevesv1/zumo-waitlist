
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Twitter, Mail, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [email, setEmail] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let finished = false;
    const img = new window.Image();
    img.src = "/bg.jpg";
    img.onload = () => {
      if (!finished) {
        setProgress(100);
        finished = true;
      }
    };
    img.onerror = () => {
      if (!finished) {
        setProgress(100);
        finished = true;
      }
    };
    // Simulate progress for style
    let fakeProgress = 0;
    interval = setInterval(() => {
      fakeProgress += Math.random() * 10 + 5;
      if (fakeProgress < 90) {
        setProgress(Math.min(fakeProgress, 90));
      }
    }, 120);
    // Minimum 3 seconds loading
    const minTimer = setTimeout(() => setMinTimePassed(true), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(minTimer);
    };
  }, []);

  useEffect(() => {
    if ((progress >= 100 || minTimePassed) && minTimePassed) {
      setBgLoaded(true);
    }
  }, [progress, minTimePassed]);

  if (!bgLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <span className="text-white text-2xl mb-6 animate-pulse">Loading...</span>
        <div className="w-64">
          <div className="relative w-full h-4 rounded-full bg-gradient-to-r from-[#232526] to-[#414345] shadow-lg overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-500 ease-out animate-glow"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const handleTwitterFollow = () => {
    window.open("https://x.com/Zumolabs_xyz", "_blank");
    setIsFollowing(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP. Try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your email address.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    // Only allow certain domains
    const allowedDomains = ["@gmail.com", "@outlook.com", "@yahoo.com"];
    const emailLower = email.toLowerCase();
    if (!allowedDomains.some(domain => emailLower.endsWith(domain))) {
      setEmailError("Only Gmail, Outlook, or Yahoo email addresses are allowed.");
      return;
    }
    if (!isFollowing) {
      toast({
        title: "Follow required",
        description: "Please follow us on Twitter first.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({
          email,
          twitter_handle: twitterHandle,
          is_following_twitter: isFollowing,
          ip_address: null,
          user_agent: navigator.userAgent,
        });
      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already registered",
            description: "This email is already on our waitlist!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        setShowWaitlistForm(false);
      }
    } catch (error) {
      console.error("Error submitting waitlist:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen w-full fixed inset-0 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-no-repeat" style={{ backgroundImage: 'url(/bg.jpg)', backgroundPosition: 'center 45%' }}></div>
          {/* Removed gradients: replaced with a single solid background */}
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-pink-500/10 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-500/10 to-transparent animate-pulse delay-2000"></div> */}
          
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float delay-2000"></div>
        </div>

        {/* Success Content */}
        <div className="relative z-10 flex items-center justify-center h-full p-4">
          <div className="text-center max-w-sm mx-auto w-full relative">
            <div className="bg-white bg-opacity-90 border border-gray-200 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center justify-center stylish-success-box">
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setTwitterHandle("");
                  setIsFollowing(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <p className="text-base md:text-lg font-semibold text-black drop-shadow-sm">
                🎉 You're all set! Follow us on Twitter for the latest updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full fixed inset-0 overflow-hidden cursor-custom">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-cover bg-no-repeat" style={{ backgroundImage: 'url(/bg.jpg)', backgroundPosition: 'center 45%' }}></div>



      {/* Join Waitlist Button - Top Right */}
      <div className="fixed z-20 top-6 right-6">
        <Button
          onClick={() => setShowWaitlistForm(true)}
          className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 glow-purple text-white font-semibold px-6 py-3 text-base shadow-lg border-2 border-white/20"
        >
          Join Waitlist
        </Button>
      </div>

      {/* Main Content - Coming Soon */}
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <h1 className="text-4xl md:text-6xl font-bold text-black text-center">Coming Soon</h1>
      </div>

      {/* Waitlist Form Modal */}
      {showWaitlistForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWaitlistForm(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-[#363062] border border-white/20 rounded-2xl p-6 md:p-8 max-w-md w-full glass-card">
            {/* Close Button */}
            <button
              onClick={() => setShowWaitlistForm(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Form Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h2>
                <p className="text-gray-300 text-sm">Be the first to know when we launch</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Twitter Follow Step */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleTwitterFollow}
                    className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                      isFollowing
                        ? "bg-green-600 hover:bg-green-700 glow-green"
                        : "bg-blue-600 hover:bg-blue-700 glow-blue"
                    }`}
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    {isFollowing ? "Following @Zumolabs_xyz ✓" : "Follow @Zumolabs_xyz"}
                  </Button>
                  
                  {isFollowing && (
                    <Input
                      type="text"
                      placeholder="Your Twitter handle (optional)"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="glass-input h-12 text-base"
                    />
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input h-12 text-base"
                    required
                  />
                  {emailError && <p className="text-xs text-red-400 text-center">{emailError}</p>}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFollowing}
                    className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300 glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Joining Waitlist...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Join Waitlist
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-xs text-gray-400 text-center">
                We'll never spam you. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden md:block absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="hidden md:block absolute top-1/2 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

      {/* All rights reserved footer */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <p className="text-xs text-black">&copy; {new Date().getFullYear()} Zumo Labs. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Index;
