"use client";

import { useState, ReactNode, useRef, useEffect, useCallback } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  content,
  children,
  position = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
    placement: position,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spacing = 8;
    let top = 0;
    let left = 0;
    let finalPlacement = position;

    // Calculate preferred position based on prop
    switch (position) {
      case "top":
        top = triggerRect.top - tooltipRect.height - spacing;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Check if tooltip would be cut off at the top
        if (top < 16) {
          // Switch to bottom
          top = triggerRect.bottom + spacing;
          finalPlacement = "bottom";
        }
        break;

      case "bottom":
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Check if tooltip would be cut off at the bottom
        if (top + tooltipRect.height > viewportHeight - 16) {
          // Switch to top
          top = triggerRect.top - tooltipRect.height - spacing;
          finalPlacement = "top";
        }
        break;

      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - spacing;

        // Check if tooltip would be cut off on the left
        if (left < 16) {
          // Switch to right
          left = triggerRect.right + spacing;
          finalPlacement = "right";
        }
        break;

      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + spacing;

        // Check if tooltip would be cut off on the right
        if (left + tooltipRect.width > viewportWidth - 16) {
          // Switch to left
          left = triggerRect.left - tooltipRect.width - spacing;
          finalPlacement = "left";
        }
        break;
    }

    // Final horizontal boundary checks
    if (left < 16) {
      left = 16;
    } else if (left + tooltipRect.width > viewportWidth - 16) {
      left = viewportWidth - tooltipRect.width - 16;
    }

    // Final vertical boundary checks
    if (top < 16) {
      top = 16;
    } else if (top + tooltipRect.height > viewportHeight - 16) {
      top = viewportHeight - tooltipRect.height - 16;
    }

    setTooltipPosition({ top, left, placement: finalPlacement });
  }, [position]);

  useEffect(() => {
    if (isVisible) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        calculatePosition();
      });

      const handleResize = () => calculatePosition();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize);
      };
    }
  }, [calculatePosition, isVisible]);

  const getArrowClasses = () => {
    const baseClasses = "absolute w-0 h-0 border-4";

    switch (tooltipPosition.placement) {
      case "top":
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800`;
      case "bottom":
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800`;
      case "left":
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800`;
      case "right":
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800`;
      default:
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800`;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block w-full h-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg relative pointer-events-auto">
            {content}
            <div className={getArrowClasses()}></div>
          </div>
        </div>
      )}
    </>
  );
}
