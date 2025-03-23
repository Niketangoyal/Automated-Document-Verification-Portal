import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle, FileCheck, Shield, Zap } from "lucide-react";
import { SignedOut } from "@clerk/nextjs";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    Secure Document Verification
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Verify Documents with Confidence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our AI-powered system verifies the authenticity of your
                    official documents quickly and accurately.
                  </p>
                </div>
                <SignedOut>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full min-[400px]:w-auto"
                    >
                      Log in
                    </Button>
                  </Link>
                </div></SignedOut>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
                    <FileCheck className="h-32 w-32 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Key Features
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our document verification system offers powerful features to
                ensure the integrity of your documents.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-lg p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Get your documents verified quickly with our advanced AI
                  algorithms.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Your documents are encrypted and stored securely in our
                  protected database.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Accurate Results</h3>
                <p className="text-sm text-muted-foreground">
                  Our system provides accurate verification results you can trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our verification process is simple, secure, and efficient.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your documents in PDF or image format through our secure
                  platform.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">AI Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI system analyzes your documents for authenticity and
                  integrity.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  Receive detailed verification results and reports for your
                  documents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full bg-primary py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[85%] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account today and start verifying your documents with
                confidence.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full  text-primary hover:bg-white/90 min-[400px]:w-auto"
                  >
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-white text-primary hover:bg-white/10 min-[400px]:w-auto"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
