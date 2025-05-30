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
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(INACTIVITY_TIMEOUT);
  const [showModal, setShowModal] = useState<boolean>(false);
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
    setShowModal(false);
    setShowConfirmation(false);
    setIsExtended(false);
  }, []);

  const handleExtendSession = useCallback(() => {
    setTimeLeft(INACTIVITY_TIMEOUT);
    setShowConfirmation(false);
    setIsExtended(true);
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
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

  // Handle logout
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

  // Handle logout from confirmation
  const handleConfirmLogout = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  // Reset timer on user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      if (timeLeft > 0) {
        resetTimer();
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeLeft, isAuthenticated, resetTimer]);

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

  // Don't show anything if user is not authenticated
  if (!isAuthenticated) return null;

  // Update countdown visibility
  useEffect(() => {
    if (timeLeft > 30 && showCountdown) {
      setShowCountdown(false);
    } else if (timeLeft <= 30 && timeLeft > 0 && !showCountdown) {
      setShowCountdown(true);
    }
  }, [timeLeft, showCountdown]);

  return (
    <>
      {/* Time left indicator in header */}
      {showCountdown && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium z-50">
          Tiempo restante: {formatTime(timeLeft)}
        </div>
      )}

      {/* Session timeout confirmation modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Deseas continuar con tu sesión?</DialogTitle>
            <DialogDescription>
              Tu sesión ha expirado por inactividad. ¿Deseas continuar?
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

      {/* Session expired modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sesión expirada</DialogTitle>
            <DialogDescription>
              Tu sesión ha expirado por inactividad. Serás redirigido a la página de inicio de sesión.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleLogout} className="w-full">
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
