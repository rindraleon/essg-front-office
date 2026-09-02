import { Card, CardContent } from '../compat/mui';
import React from 'react';
import { GREEN } from '@/constants';
import type { ContactInfoCardsProps } from '@/types';

const ContactInfoCards: React.FC<ContactInfoCardsProps> = (
  props: Readonly<ContactInfoCardsProps>
) => {
  const { items = [] } = props;

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: GREEN[50] }}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold text-ink-900">{item.title}</h3>
            </div>

            <div className="space-y-1 pl-11">
              {item.lines.map((line, index) => (
                <p key={`${item.id}-line-${index}`} className="text-small text-ink-500">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactInfoCards;
