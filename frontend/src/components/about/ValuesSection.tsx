import teamPhoto from '@/components/assets/h4igroup_photo.jpg';

const values = [
  {
    title: 'Go Beyond Technology',
    description:
      'Technology is only one tool we use in our greater mission for social impact. We learn from, work with, and are inspired by others tackling social problems using a multitude of tools.',
  },
  {
    title: 'Develop with Care',
    description:
      'We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. We work to deeply understand the people we are helping.',
  },
  {
    title: 'Be Open Minded',
    description:
      'Our process depends on openness to different people, topics, and perspectives. We embrace difference and work against intolerance to foster an inclusive environment.',
  },
];

export default function ValuesSection() {
  return (
    <section className="py-16 px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div key={value.title}>
              <img
                src={teamPhoto}
                alt={value.title}
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
              <h3 className="font-heading text-xl font-bold text-foreground mt-4">
                {value.title}
              </h3>
              <p className="font-body text-base text-muted-foreground mt-2 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
