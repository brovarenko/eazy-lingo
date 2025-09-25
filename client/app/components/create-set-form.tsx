'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface CreateSetFormProps {
  onSetCreated: () => void;
  onCancel: () => void;
}

const CreateSetForm: FC<CreateSetFormProps> = ({ onSetCreated, onCancel }) => {
  const [setName, setSetName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(
        'http://localhost:3001/sets',
        {
          name: setName,
          isCommon: false, // Default to false for user-created sets
          // userId will be added by the backend based on auth token
        },
        {
          withCredentials: true,
        }
      );
      toast({
        title: 'Set Created!',
        description: 'Your new set has been successfully created.',
      });
      onSetCreated();
    } catch (error) {
      console.error('Failed to create set:', error);
      toast({
        title: 'Error',
        description: 'Failed to create set. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Set'}
        </Button>
      </div>
    </form>
  );
};

export default CreateSetForm;
