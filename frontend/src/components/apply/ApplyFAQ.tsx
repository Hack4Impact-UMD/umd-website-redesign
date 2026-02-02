import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { ApplySection, SectionHeader } from './ApplyPageLayout';

type FaqItem = {
  question: string;
  answer: string;
};

type ApplyFaqProps = {
  heading: string;
  items: FaqItem[];
};

function ApplyFaq({ heading, items }: ApplyFaqProps) {
  return (
    <ApplySection>
      <div className="space-y-8">
        <SectionHeader title={heading} />
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-heading text-base font-bold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ApplySection>
  );
}

export default ApplyFaq;
