import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ApplyTestimonials from './ApplyTestimonials';

describe('ApplyTestimonials', () => {
  it('does not emit duplicate-key errors for repeated placeholder names', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ApplyTestimonials
        testimonials={[
          { quote: 'First', name: 'Nonprofit Person', organization: 'Organization Name' },
          { quote: 'Second', name: 'Nonprofit Person', organization: 'Organization Name' },
        ]}
      />,
    );
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
