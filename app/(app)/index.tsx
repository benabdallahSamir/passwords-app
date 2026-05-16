import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { usePasswordStore } from '@/store/usePasswordStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const passwords = usePasswordStore((s) => s.passwords);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const filteredPasswords = useMemo(() => {
    return passwords.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.appName.toLowerCase().includes(search.toLowerCase()) ||
                          p.username.toLowerCase().includes(search.toLowerCase()) ||
                          p.email.toLowerCase().includes(search.toLowerCase()) ||
                          p.note.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory ? p.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
      return matchSearch && matchCategory;
    });
  }, [passwords, search, filterCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Category"
          value={filterCategory}
          onChangeText={setFilterCategory}
        />
      </View>

      <FlatList
        data={filteredPasswords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/(app)/password/${item.id}`)}
          >
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.appName} • {item.username || item.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No passwords found.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(app)/password/add')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, paddingHorizontal: 12, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  filterContainer: { paddingHorizontal: 16, marginBottom: 16 },
  filterInput: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  subtitle: { fontSize: 14, color: '#666' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#007AFF', shadowOpacity: 0.4, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
});
