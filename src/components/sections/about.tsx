import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <Badge>About Me</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Story in Every Stitch</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I'm Sajani Muthusinghe, a passionate and innovative fashion design student with a keen eye for detail and a love for storytelling through textiles. My work explores the intersection of classic tailoring and modern, sustainable practices.
            </p>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I believe fashion is a form of wearable art that should not only be aesthetically pleasing but also evoke emotion and reflect individuality. My design process is deeply rooted in research, experimentation with unconventional materials, and a commitment to creating timeless pieces that empower the wearer.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://scontent.fcmb2-2.fna.fbcdn.net/v/t39.30808-6/492224889_122158093724498058_9133456131604945616_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEn2L35xGBgF4AOHgu2dSGRRZPa-hi80oNFk9r6GLzSg7doL9YL1vH6MpFTvK0Qb3gwjecg6r1BpXAJdUW1v8jC&_nc_ohc=0sXGKvxejKcQ7kNvwGDkr6i&_nc_oc=AdlPMlgVWNI2YFIy-hAqcA_-loN-KPdReIB7-w7eSBQulVhLvbY93qYMFNfYZqyJqJg&_nc_zt=23&_nc_ht=scontent.fcmb2-2.fna&_nc_gid=RBDJ2DI9Jg-k-5GWnWm8dw&oh=00_AfR-A0WaI8x4bM-t1VCyKyW8vELfT7UsvKen80REbErqAg&oe=6893E8FD"
              alt="Portrait of Sajani Muthusinghe"
              data-ai-hint="fashion designer portrait"
              width={550}
              height={550}
              className="rounded-full object-cover w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
