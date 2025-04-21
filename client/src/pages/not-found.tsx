import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 - Page Not Found</h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            We couldn't find the page you were looking for.
          </p>
        </div>
        <Button onClick={() => setLocation('/')}>
          Go Back Home
        </Button>
      </div>
    </div>
  );
}