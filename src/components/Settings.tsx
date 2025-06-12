import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

// Define the key for localStorage
const PRACTICE_ITEMS_KEY = 'guitar-gym-practice-items';

export interface PracticeItem {
  id: string;
  name: string;
}

export function Settings() {
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([]);
  const [newItem, setNewItem] = useState("");

  // Load practice items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem(PRACTICE_ITEMS_KEY);
    if (savedItems) {
      setPracticeItems(JSON.parse(savedItems));
    }
  }, []);

  // Save practice items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PRACTICE_ITEMS_KEY, JSON.stringify(practiceItems));
  }, [practiceItems]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    const item: PracticeItem = {
      id: Date.now().toString(),
      name: newItem.trim()
    };

    setPracticeItems(prev => [...prev, item]);
    setNewItem("");
    toast.success("Practice item added!");
  };

  const handleRemoveItem = (id: string) => {
    setPracticeItems(prev => prev.filter(item => item.id !== id));
    toast.success("Practice item removed!");
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
              />
              <Button 
                onClick={handleAddItem}
                disabled={!newItem.trim()}
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
