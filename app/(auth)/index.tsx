import { View, Button, TextInput, FlatList, Text, ListRenderItem, StyleSheet } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Todo } from '@/utils/interfaces';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const Page = () => {
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos on start
  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const newTodo = {
      user_id: User?.id,
      task: todo,
    };

    setLoading(true);
    const result = await supabase.from('todos').insert(newTodo).select().single();

    setTodos([result.data, ...todos]);
    setLoading(false);
    setTodo('');
  };

  // Get all data from the todos table
  const loadTodos = async () => {
    let { data } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false });
    setTodos(data || []);
  };

  const renderRow: ListRenderItem<Todo> = ({ item }) => {
    return (
      <AppleStyleSwipeableRow
        onDelete={() => deleteTodo(item)}
        onToggle={() => updateTodo(item)}
        todo={item}>
        <View style={{ padding: 12, flexDirection: 'row', gap: 10, height: 44 }}>
          <Text style={{ flex: 1 }}>{item.task}</Text>
          {item.is_complete && <Ionicons name="checkmark-done-outline" size={24} color="#151515" />}
        </View>
      </AppleStyleSwipeableRow>
    );
  };

  const updateTodo = async (todo: Todo) => {
    console.log('UPDATE: ', todo);

    const result = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id)
      .select()
      .single();

    const updated = todos.map((item) => {
      if (item.id === todo.id) {
        item.is_complete = result.data.is_complete;
      }
      return item;
    });
    setTodos(updated);
  };

  const deleteTodo = async (todo: Todo) => {
    await supabase.from('todos').delete().eq('id', todo.id);
    const updated = todos.filter((item) => item.id !== todo.id);
    setTodos(updated);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: 10, backgroundColor: '#151515', padding: 6 }}>
        <TextInput
          placeholder="Add Todo"
          style={{
            flex: 1,
            backgroundColor: '#363636',
            color: '#fff',
            padding: 8,
            borderWidth: 1,
            borderColor: '#2b825b',
            borderRadius: 4,
          }}
          value={todo}
          onChangeText={setTodo}
        />
        <Button title="Add" color={'#2b825b'} onPress={addTodo} disabled={loading || todo === ''} />
      </View>

      <FlatList
        data={todos}
        renderItem={renderRow}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: StyleSheet.hairlineWidth, width: '100%', backgroundColor: 'gray' }}
          />
        )}
      />
    </View>
  );
};
export default Page;