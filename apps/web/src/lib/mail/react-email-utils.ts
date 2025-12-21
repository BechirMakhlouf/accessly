import { render } from '@react-email/render';

/**
 * Utility to render React email components to HTML string
 * This is useful for services that don't support React directly (like Inbucket)
 */
export async function renderReactEmail(
  reactElement: React.ReactElement
): Promise<string> {
  try {
    return await render(reactElement);
  } catch (error) {
    console.error('Failed to render React email:', error);
    // Fallback to a simple HTML structure
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Content</h2>
        <p>There was an error rendering the email content.</p>
      </div>
    `;
  }
}
