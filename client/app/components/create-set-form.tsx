'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateSetFormProps {
  onSetCreated: () => void;
  onCancel: () => void;
}

const CreateSetForm: FC<CreateSetFormProps> = ({ onSetCreated, onCancel }) => {
  const [setName, setSetName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSetMutation = useMutation({
    mutationFn: async (payload: { name: string; isCommon: boolean }) => {
      return api.post('/sets', payload);
    },
    onSuccess: () => {
      toast({ title: 'Set Created!', description: 'Your new set has been successfully created.' });
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
      onSetCreated();
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create set. Please try again.', variant: 'destructive' });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSetMutation.mutateAsync({ name: setName, isCommon: false });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='setName'>Set Name</Label>
        <Input
          id='setName'
          type='text'
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder='My new word set'
          required
          className='mt-1'
        />
      </div>
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={createSetMutation.isPending}>
          {createSetMutation.isPending ? 'Creating...' : 'Create Set'}
        </Button>
      </div>
    </form>
  );
};

export default CreateSetForm;