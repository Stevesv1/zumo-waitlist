
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        handleGoogleSignIn(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async (user: any) => {
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
          email: user.email,
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

  const handleTwitterFollow = () => {
    window.open("https://x.com/Zumolabs_xyz", "_blank");
    setIsFollowing(true);
  };

  const handleGoogleAuth = async () => {
    if (!isFollowing) {
      toast({
        title: "Follow required",
        description: "Please follow us on Twitter first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error("Google auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Google. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error with Google auth:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen w-full fixed inset-0 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = 0.5;
              }
            }}
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Success Content */}
        <div className="relative z-10 flex items-center justify-center h-full p-4">
          <div className="text-center max-w-sm mx-auto w-full">
            <div className="glass-card p-6 md:p-8">
              <p className="text-base md:text-lg text-white">
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
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 0.5;
            }
          }}
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full p-4">
        <div className="text-center space-y-6 md:space-y-8 max-w-sm md:max-w-md mx-auto w-full">
          {/* Logo/Brand */}
          <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                REDACTED
              </span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg lg:text-xl font-light">
              Something amazing is coming
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="glass-card p-6 md:p-8 space-y-5 md:space-y-6">
            <div className="space-y-5 md:space-y-6">
              {/* Twitter Follow Step */}
              <div className="space-y-3 md:space-y-4">
                <Button
                  type="button"
                  onClick={handleTwitterFollow}
                  className={`w-full h-11 md:h-12 text-sm md:text-base font-semibold transition-all duration-300 ${
                    isFollowing
                      ? "bg-green-600 hover:bg-green-700 glow-green"
                      : "bg-blue-600 hover:bg-blue-700 glow-blue"
                  }`}
                >
                  <Twitter className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {isFollowing ? "Following @Zumolabs_xyz ✓" : "Follow @Zumolabs_xyz"}
                </Button>
                
                {isFollowing && (
                  <Input
                    type="text"
                    placeholder="Your Twitter handle (optional)"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="glass-input h-11 md:h-12 text-sm md:text-base"
                  />
                )}
              </div>

              {/* Google Sign In */}
              <div className="space-y-3 md:space-y-4">
                <Button
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting || !isFollowing}
                  className="w-full h-11 md:h-12 text-sm md:text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                      Joining Waitlist...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Secure authentication with Google. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden md:block absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="hidden md:block absolute top-1/2 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};

export default Index;
