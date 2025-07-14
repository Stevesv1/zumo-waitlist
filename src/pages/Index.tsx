
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Twitter, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  const handleTwitterFollow = () => {
    window.open("https://x.com/Zumolabs_xyz", "_blank");
    setIsFollowing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
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
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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

              {/* Email Input */}
              <div className="space-y-3 md:space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input h-11 md:h-12 text-sm md:text-base"
                  required
                />
                
                <Button
                  type="submit"
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
                      <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
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

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden md:block absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="hidden md:block absolute top-1/2 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};

export default Index;
