export const metadata = { title: "WICCLAW — AI That Doesn't Just Think. It Works.", description: "Meet your autonomous AI workforce. Request a WICCLAW demo or join the $49 pre-order waitlist.", alternates: { canonical: "/" }, openGraph: { title: "WICCLAW — AI That Doesn't Just Think. It Works.", description: "Quiet intelligence. Real execution." } };
import LandingPage from '@/components/LandingPage'
import PrelaunchHome from '@/components/prelaunch/Home'
import { prelaunchEnabled } from '@/lib/prelaunch/config'

export default function Home() {
  return prelaunchEnabled ? <PrelaunchHome /> : <LandingPage />
}
