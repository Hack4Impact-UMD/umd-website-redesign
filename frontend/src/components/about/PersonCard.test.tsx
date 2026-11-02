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

  it('shows initials instead of a placeholder image when there is no headshot', () => {
    const { container } = render(<PersonCard name="Test Member" role="Engineer" prominent />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('TM')).toBeInTheDocument();
  });

  it('shows the headshot when one is provided', () => {
    render(<PersonCard name="Test Member" role="Engineer" imageSrc="/assets/test.png" />);
    expect(screen.getByAltText('Test Member headshot')).toHaveAttribute('src', '/assets/test.png');
  });
});
