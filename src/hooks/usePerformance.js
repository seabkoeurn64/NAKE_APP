// hooks/usePerformance.js
import { useEffect, useRef, useState, useCallback } from 'react';

export const usePerformance = (options = {}) => {
  const {
    enabled = true,
    logToConsole = false,
    sendToAnalytics = false,
    analyticsEndpoint = '/api/analytics',
    threshold = 4000,
    onPoorPerformance,
    customMetrics = {}
  } = options;

  const metricsRef = useRef({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    custom: {}
  });

  const reportMetric = useRef((metric) => {
    const { name, value, rating } = metric;

    metricsRef.current[name] = { value, rating, timestamp: Date.now() };

    if (logToConsole) {
      console.log(`[Performance] ${name}:`, {
        value: value.toFixed(2),
        rating,
        timestamp: new Date().toISOString()
      });
    }

    if (sendToAnalytics) {
      sendToAnalyticsEndpoint(metric);
    }

    if (rating === 'poor' && onPoorPerformance) onPoorPerformance(metric);

    if (value > threshold && name === 'LCP') {
      console.warn(`[Performance Warning] LCP exceeded threshold: ${value}ms`);
    }
  });

  const sendToAnalyticsEndpoint = async (metric) => {
    try {
      const payload = {
        ...metric,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        connection: navigator.connection
          ? {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt
            }
          : null
      };

      if (analyticsEndpoint) {
        await fetch(analyticsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
      }
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  };

  const measureCustomMetric = (name, value) => {
    metricsRef.current.custom[name] = { value, timestamp: Date.now() };
    if (logToConsole) console.log(`[Custom Metric] ${name}:`, value);
  };

  const getPerformanceMetrics = () => ({ ...metricsRef.current });

  useEffect(() => {
    if (!enabled) return;

    const initWebVitals = async () => {
      try {
        const webVitalsModule = await import('web-vitals');
        const webVitals = webVitalsModule.default || webVitalsModule;

        if (webVitals.getCLS) {
          webVitals.getCLS(reportMetric.current);
          webVitals.getFID(reportMetric.current);
          webVitals.getLCP(reportMetric.current);
          webVitals.getFCP(reportMetric.current);
          webVitals.getTTFB(reportMetric.current);
        } else if (webVitals.onCLS) {
          webVitals.onCLS(reportMetric.current);
          webVitals.onFID(reportMetric.current);
          webVitals.onLCP(reportMetric.current);
          webVitals.onFCP(reportMetric.current);
          webVitals.onTTFB(reportMetric.current);
        }
      } catch (error) {
        console.warn('web-vitals not available:', error);
      }
    };

    initWebVitals();
  }, [enabled]);

  return {
    getMetrics: getPerformanceMetrics,
    measureCustomMetric,
    metrics: metricsRef.current
  };
};
