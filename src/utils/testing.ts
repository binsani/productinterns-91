// Testing utilities for the application

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

// Define type for user event setup
type UserEvent = {
  setup(): any;
};

// Check if userEvent is available (test environment)
let userEvent: UserEvent | undefined;
try {
  const userEventModule = require('@testing-library/user-event');
  userEvent = userEventModule.default || userEventModule;
} catch {
  // userEvent not available in non-test environment
}

// Custom render function with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: {
    queryClient?: QueryClient;
    initialRoute?: string;
  }
) => {
  const queryClient = options?.queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );

  if (options?.initialRoute) {
    window.history.pushState({}, 'Test page', options.initialRoute);
  }

  return {
    user: userEvent?.setup ? userEvent.setup() : null,
    ...render(ui, { wrapper: Wrapper }),
  };
};

// Test data factories
export const testDataFactory = {
  user: (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),

  profile: (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    role: 'intern' as const,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),

  internship: (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Software Engineer Intern',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'Join our team as a software engineering intern...',
    requirements: ['Computer Science degree', 'Programming experience'],
    application_deadline: '2024-12-31',
    start_date: '2024-06-01',
    duration_months: 3,
    is_paid: true,
    salary_min: 3000,
    salary_max: 5000,
    is_remote: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    employer_id: '123e4567-e89b-12d3-a456-426614174002',
    ...overrides,
  }),

  application: (overrides = {}) => ({
    id: '123e4567-e89b-12d3-a456-426614174003',
    internship_id: '123e4567-e89b-12d3-a456-426614174001',
    applicant_id: '123e4567-e89b-12d3-a456-426614174000',
    status: 'applied' as const,
    cover_letter: 'I am excited to apply for this position...',
    resume_url: 'https://example.com/resume.pdf',
    applied_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),
};

// Custom matchers
export const customMatchers = {
  toBeLoading: (element: HTMLElement) => ({
    pass: element.getAttribute('aria-busy') === 'true' || 
          element.classList.contains('loading') ||
          element.querySelector('[data-testid="loading-spinner"]') !== null,
    message: () => 'Expected element to be in loading state',
  }),

  toHaveValidationError: (element: HTMLElement, message?: string) => {
    const errorElement = element.parentElement?.querySelector('[role="alert"]') ||
                        element.parentElement?.querySelector('.error-message');
    
    const hasError = errorElement !== null;
    const hasCorrectMessage = message ? errorElement?.textContent?.includes(message) : true;
    
    return {
      pass: hasError && hasCorrectMessage,
      message: () => message 
        ? `Expected element to have validation error with message "${message}"`
        : 'Expected element to have validation error',
    };
  },
};

// Test helpers
export const testHelpers = {
  // Wait for loading to complete
  waitForLoadingToFinish: async (element?: HTMLElement) => {
    const container = element || document.body;
    await waitFor(() => {
      expect(container.querySelector('[data-testid="loading-spinner"]')).not.toBeInTheDocument();
    });
  },

  // Fill form fields
  fillForm: async (user: any, fields: Record<string, string>) => {
    for (const [fieldName, value] of Object.entries(fields)) {
      const field = screen.getByRole('textbox', { name: new RegExp(fieldName, 'i') }) ||
                   screen.getByLabelText(new RegExp(fieldName, 'i'));
      if (user?.clear && user?.type) {
        await user.clear(field);
        await user.type(field, value);
      }
    }
  },

  // Submit form
  submitForm: async (user: any, buttonText = 'submit') => {
    const submitButton = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
    if (user?.click) {
      await user.click(submitButton);
    } else {
      fireEvent.click(submitButton);
    }
  },

  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach(key => delete store[key]);
        },
      },
      writable: true,
    });
  },

  // Mock window.matchMedia for responsive tests
  mockMatchMedia: () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    });
  },
};

// Performance testing utilities
export const performanceHelpers = {
  measureRenderTime: async (component: ReactElement) => {
    const start = performance.now();
    renderWithProviders(component);
    await waitFor(() => {
      expect(screen.getByText(/./)).toBeInTheDocument();
    });
    const end = performance.now();
    return end - start;
  },

  measureAsyncOperation: async (operation: () => Promise<void>) => {
    const start = performance.now();
    await operation();
    const end = performance.now();
    return end - start;
  },
};

// Accessibility testing helpers
export const a11yHelpers = {
  checkHeadingHierarchy: () => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const levels = headings.map(h => parseInt(h.tagName.charAt(1)));
    
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        throw new Error(`Heading hierarchy violation: h${levels[i-1]} followed by h${levels[i]}`);
      }
    }
  },

  checkColorContrast: (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    const backgroundColor = style.backgroundColor;
    const color = style.color;
    
    // This is a simplified check - in real tests you'd use a proper contrast checker
    return backgroundColor !== color;
  },

  checkAltText: () => {
    const images = Array.from(document.querySelectorAll('img'));
    const missingAlt = images.filter(img => !img.alt && !img.getAttribute('aria-hidden'));
    
    if (missingAlt.length > 0) {
      throw new Error(`${missingAlt.length} images missing alt text`);
    }
  },
};

export * from '@testing-library/react';
export { userEvent };