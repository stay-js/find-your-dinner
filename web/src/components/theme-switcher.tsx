'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useMounted } from '~/hooks/use-mounted';

const themes = [
  { icon: Sun, name: 'Világos', value: 'light' },
  { icon: Moon, name: 'Sötét', value: 'dark' },
  { icon: Monitor, name: 'Rendszer', value: 'system' },
];

export function ThemeSwitcher() {
  const mounted = useMounted();
  const { setTheme, theme } = useTheme();

  if (!mounted) return <div className="h-9" />;

  return (
    <Select onValueChange={setTheme} value={theme ?? 'system'}>
      <SelectTrigger id="theme">
        <SelectValue placeholder="Válassz témát" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Témák</SelectLabel>

          {themes?.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              <theme.icon className="size-4" />
              <span>{theme.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
