import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">By accessing and using the Automated Document Verification Portal ("DocVerify"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">DocVerify provides an AI-powered platform for the verification of official documents. Our system utilizes Optical Character Recognition (OCR) and machine learning models to assess document authenticity.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>When using our services, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You will only upload documents that you have the legal right to possess and verify.</li>
                <li>You will not upload forged, altered, or counterfeit documents with malicious intent.</li>
                <li>You will maintain the confidentiality of your account credentials.</li>
                <li>You accept that verification results are provided "as is" and should not be the sole basis for critical legal or financial decisions.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">In no event shall DocVerify be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service. Verification results are algorithmic assessments and do not constitute legal guarantees of authenticity.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
