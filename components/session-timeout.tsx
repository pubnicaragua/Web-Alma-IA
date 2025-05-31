'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState, useCallback, useRef } from 'react';

const INACTIVITY_TIMEOUT = 60; // 1 minute in seconds

export function SessionTimeout() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number>(INACTIVITY_TIMEOUT);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const confirmationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
    logout();
    router.push('/login');
  }, [logout, router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
    setTimeLeft(INACTIVITY_TIMEOUT);
    setShowConfirmation(false);
    setIsExtended(false);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  const showSessionExpirationModal = useCallback(() => {
    setShowConfirmation(true);
    confirmationTimerRef.current = setTimeout(() => {
      if (!isExtended) {
        handleLogout();
      }
    }, 30000);
  }, [isExtended, handleLogout]);

  // Effect to handle the countdown
  useEffect(() => {
    if (!isAuthenticated) return;

    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timeLeft <= 0) {
      showSessionExpirationModal();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, isAuthenticated, showSessionExpirationModal]);

  // Handle session extension
  const handleExtendSession = useCallback(() => {
    setTimeLeft(INACTIVITY_TIMEOUT);
    setShowConfirmation(false);
    setIsExtended(true);
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
  }, []);

  // Calculate remaining time for the confirmation dialog (30 seconds total)
  const [confirmationTimeLeft, setConfirmationTimeLeft] = useState(30);

  useEffect(() => {
    if (!showConfirmation) {
      setConfirmationTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setConfirmationTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showConfirmation]);

  

  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (confirmationTimerRef.current) clearTimeout(confirmationTimerRef.current);
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show confirmation when time is up
  useEffect(() => {
    if (isAuthenticated && timeLeft <= 0) {
      showSessionExpirationModal();
    }
  }, [timeLeft, isAuthenticated, showSessionExpirationModal]);

  // Don't render anything if user is not authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Session timeout confirmation modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Deseas continuar con tu sesión?</DialogTitle>
            <DialogDescription>
              Tu sesión está a punto de expirar. ¿Deseas continuar?
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  La sesión se cerrará en: <span className="font-semibold">{confirmationTimeLeft} segundos</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${(confirmationTimeLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleConfirmLogout}>
              Cerrar sesión
            </Button>
            <Button onClick={handleExtendSession}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
