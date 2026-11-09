import type { ProjectEntity } from './contracts';

/**
 * Adds each project's brand colour, read from its partner logo, to the
 * projects a build loaded. Only projects with a screenshot get one: it is the
 * panel colour behind the screenshot on cards, and logo-only cards do not use
 * it. A logo that cannot be loaded, or has no real colour, leaves the project
 * without one, and the card falls back to navy.
 */
export const withBrandColors = async (projects: ProjectEntity[]): Promise<ProjectEntity[]> => {
  const needed = projects.filter(
    ({ attributes }) => (attributes.screenshots?.data.length ?? 0) > 0 && attributes.image.data[0],
  );
  if (needed.length === 0) return projects;

  // Build-only dependencies, loaded only when there is work for them.
  const [{ default: sharp }, { fetchMedia }, { dominantColor, panelColor }] = await Promise.all([
    import('sharp'),
    import('@/og/photos'),
    import('@/lib/brandColor'),
  ]);

  const colorOf = async (logo: string) => {
    try {
      const bytes = await fetchMedia(logo);
      if (!bytes) return undefined;
      const { data, info } = await sharp(bytes)
        .resize(48, 48, { fit: 'inside' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const color = dominantColor(data, info.channels);
      return color ? panelColor(color) : undefined;
    } catch (error) {
      console.warn(`[brand] Could not read a colour from ${logo}; using navy.`, error);
      return undefined;
    }
  };

  const colors = new Map(
    await Promise.all(
      needed.map(async ({ id, attributes }) => [id, await colorOf(attributes.image.data[0].attributes.url)] as const),
    ),
  );
  return projects.map((project) => {
    const brandColor = colors.get(project.id);
    return brandColor ? { ...project, attributes: { ...project.attributes, brandColor } } : project;
  });
};
