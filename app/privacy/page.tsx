import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">We collect information you provide directly to us when you use our automated document verification portal. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Personal identification information (Name, email address, etc.)</li>
                <li>Documents you upload for verification purposes</li>
                <li>Usage data and interaction with our services</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and verify your documents securely</li>
                <li>Communicate with you regarding your verifications</li>
                <li>Ensure compliance with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">We implement appropriate technical and organizational security measures to protect your personal information and documents against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">If you have any questions about this Privacy Policy, please contact us through our Contact page.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
