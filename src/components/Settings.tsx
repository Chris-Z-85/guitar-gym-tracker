import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/lib/context/AuthProvider';
import { fetchPracticeItems, addPracticeItem, deletePracticeItem } from '@/lib/practice-items';
import type { PracticeItem } from '@/types/firestore';

export function Settings() {
  const { user } = useAuth();
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const loadPracticeItems = async () => {
      try {
        const items = await fetchPracticeItems(user.uid);
        setPracticeItems(items);
      } catch (error) {
        toast.error("Failed to load practice items");
        console.error(error);
      }
    };

    loadPracticeItems();
  }, [user]);

  const handleAddItem = async () => {
    if (!user || !newItem.trim()) return;
    
    setIsLoading(true);
    try {
      const item = await addPracticeItem({
        name: newItem.trim(),
        user_id: user.uid
      });
      setPracticeItems(prev => [...prev, item]);
      setNewItem("");
      toast.success("Practice item added!");
    } catch (error) {
      toast.error("Failed to add practice item");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setIsLoading(true);
    try {
      await deletePracticeItem(id);
      setPracticeItems(prev => prev.filter(item => item.id !== id));
      toast.success("Practice item removed!");
    } catch (error) {
      toast.error("Failed to remove practice item");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newItem">Add New Practice Item</Label>
            <div className="flex gap-2">
              <Input
                id="newItem"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Scales, Chords, Song Name..."
                disabled={isLoading}
              />
              <Button 
                onClick={handleAddItem}
                disabled={!newItem.trim() || isLoading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Select Items</Label>
            <div className="flex flex-wrap gap-2">
              {practiceItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-secondary"
                >
                  <span>{item.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-4 h-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {practiceItems.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No practice items added yet. Add some above to create quick select buttons.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
