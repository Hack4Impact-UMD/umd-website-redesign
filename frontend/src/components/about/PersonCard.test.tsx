import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PersonCard from './PersonCard';

describe('PersonCard link safety', () => {
  it('renders a safe HTTPS LinkedIn URL', () => {
    render(
      <PersonCard
        name="Test Member"
        role="Engineer"
        linkedinUrl="https://www.linkedin.com/in/test-member"
      />,
    );
    expect(screen.getByRole('link', { name: /test member's linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/test-member',
    );
  });

  it.each(['javascript:alert(1)', 'http://linkedin.com/in/test', 'https://user:pass@linkedin.com/in/test', 'https://example.com/in/test'])(
    'does not anchor unsafe member URL %s',
    (linkedinUrl) => {
      render(<PersonCard name="Test Member" role="Engineer" linkedinUrl={linkedinUrl} />);
      expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
    },
  );
});
