import type { Project } from '@/lib/projects';
import { CollectionEntry } from './collection-entry';

export function ProjectGrid({ projects, priorityCount = 0 }: { projects: Project[]; priorityCount?: number }) {
  return (
    <ul className="mx-auto grid w-full max-w-[52rem] grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
      {projects.map((project, index) => (
        <li key={project.id}>
          <CollectionEntry project={project} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
