'use client';

import { useEffect, useState } from 'react';
import {
Card,
CardHeader,
CardTitle,
CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
const [prefs, setPrefs] = useState({
name: '',
email: '',
org: '',
useCrores: true,
});

useEffect(() => {
const stored = localStorage.getItem('zonePrefs');
if (stored) setPrefs(JSON.parse(stored));
}, []);

const handleChange = (key, value) => {
setPrefs((prev) => ({ ...prev, [key]: value }));
};

const handleSave = () => {
localStorage.setItem('zonePrefs', JSON.stringify(prefs));
alert('Settings saved!');
};

return (
<div className="p-6 space-y-8 max-w-2xl mx-auto">
<h1 className="text-2xl font-bold">Settings</h1>
  <Card>
    <CardHeader>
      <CardTitle>Profile</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={prefs.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          value={prefs.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
      <div>
        <Label>Organization</Label>
        <Input
          value={prefs.org}
          onChange={(e) => handleChange('org', e.target.value)}
        />
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Preferences</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Display Value in ₹ Cr</Label>
        <Switch
          checked={prefs.useCrores}
          onCheckedChange={(v) => handleChange('useCrores', v)}
        />
      </div>
    </CardContent>
  </Card>

  <div className="text-right">
    <Button onClick={handleSave}>Save Preferences</Button>
  </div>
</div>
);
}

