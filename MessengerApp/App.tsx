import React, {useMemo, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Contact = {id: string; name: string; initials: string; color: string; message: string; time: string; unread?: number; online?: boolean};
type ChatMessage = {id: string; text: string; mine?: boolean; time: string};

const contacts: Contact[] = [
  {id: '1', name: 'Sofia Martinez', initials: 'SM', color: '#EEA77E', message: 'Sounds great! See you then ✨', time: '10:42', unread: 2, online: true},
  {id: '2', name: 'Alex Johnson', initials: 'AJ', color: '#7CAAF1', message: 'Did you see the new design?', time: '09:15', online: true},
  {id: '3', name: 'Emma Wilson', initials: 'EW', color: '#B095DD', message: 'Photo', time: 'Yesterday'},
  {id: '4', name: 'David Kim', initials: 'DK', color: '#66BDB0', message: 'Thank you so much!', time: 'Yesterday'},
  {id: '5', name: 'Olivia Brown', initials: 'OB', color: '#E68CAC', message: 'Let’s catch up this weekend.', time: 'Friday'},
  {id: '6', name: 'Noah Anderson', initials: 'NA', color: '#D7A95E', message: 'Voice message', time: 'Thursday'},
];

const starters: Record<string, ChatMessage[]> = {
  '1': [
    {id: 'a', text: 'Hey! Are we still on for coffee later?', time: '10:36'},
    {id: 'b', text: 'Absolutely! I was just about to message you.', mine: true, time: '10:38'},
    {id: 'c', text: 'Sounds great! See you then ✨', time: '10:42'},
  ],
  '2': [{id: 'a', text: 'Did you see the new design?', time: '09:15'}],
};

function Avatar({contact, large = false}: {contact: Contact; large?: boolean}) {
  return <View style={[styles.avatar, large && styles.largeAvatar, {backgroundColor: contact.color}]}><Text style={[styles.initials, large && styles.largeInitials]}>{contact.initials}</Text>{contact.online && !large && <View style={styles.onlineDot} />}</View>;
}

function App(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [draft, setDraft] = useState('');
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(starters);
  const [calling, setCalling] = useState(false);
  const filteredContacts = useMemo(() => contacts.filter(contact => contact.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const messages = activeContact ? (chats[activeContact.id] || []) : [];

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeContact) return;
    setChats(current => ({...current, [activeContact.id]: [...(current[activeContact.id] || []), {id: Date.now().toString(), text, mine: true, time: 'Now'}]}));
    setDraft('');
  };

  if (calling && activeContact) {
    return <SafeAreaView style={styles.callScreen}>
      <StatusBar barStyle="light-content" backgroundColor="#24203C" />
      <View style={styles.callContent}><Avatar contact={activeContact} large /><Text style={styles.callName}>{activeContact.name}</Text><Text style={styles.callState}>Calling…</Text></View>
      <TouchableOpacity style={styles.endCall} onPress={() => setCalling(false)} accessibilityLabel="End call"><Text style={styles.endCallIcon}>✕</Text></TouchableOpacity>
    </SafeAreaView>;
  }

  if (activeContact) {
    return <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8FC" />
      <View style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveContact(null)} style={styles.backButton} accessibilityLabel="Back to chats"><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
          <Avatar contact={activeContact} />
          <View style={styles.chatTitle}><Text style={styles.chatName}>{activeContact.name}</Text><Text style={styles.presence}>{activeContact.online ? 'online' : 'last seen recently'}</Text></View>
          <TouchableOpacity onPress={() => setCalling(true)} style={styles.callButton} accessibilityLabel={`Call ${activeContact.name}`}><View style={styles.phoneIcon}><View style={styles.phoneGrip} /><View style={[styles.phoneEnd, styles.phoneTop]} /><View style={[styles.phoneEnd, styles.phoneBottom]} /></View></TouchableOpacity>
          <TouchableOpacity style={styles.moreButton} accessibilityLabel="More options"><Text style={styles.moreIcon}>⋮</Text></TouchableOpacity>
        </View>
        <FlatList data={messages} keyExtractor={item => item.id} contentContainerStyle={styles.messageList} showsVerticalScrollIndicator={false} ListHeaderComponent={<Text style={styles.dayPill}>TODAY</Text>} renderItem={({item}) => <View style={[styles.bubble, item.mine ? styles.myBubble : styles.theirBubble]}><Text style={[styles.bubbleText, item.mine && styles.myBubbleText]}>{item.text}</Text><Text style={[styles.bubbleTime, item.mine && styles.myBubbleTime]}>{item.time}</Text></View>} />
        <View style={styles.composer}><TouchableOpacity style={styles.attachButton} accessibilityLabel="Add attachment"><Text style={styles.attachIcon}>＋</Text></TouchableOpacity><TextInput value={draft} onChangeText={setDraft} onSubmitEditing={sendMessage} placeholder="Write a message…" placeholderTextColor="#9A9AAF" style={styles.messageInput} returnKeyType="send" /><TouchableOpacity onPress={sendMessage} style={[styles.sendButton, !draft.trim() && styles.sendButtonMuted]} accessibilityLabel="Send message"><Text style={styles.sendIcon}>➤</Text></TouchableOpacity></View>
      </View>
    </SafeAreaView>;
  }

  return <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" backgroundColor="#F8F8FC" />
    <View style={styles.container}><View style={styles.header}><View><Text style={styles.greeting}>Messages</Text><Text style={styles.subtitle}>Stay connected with your friends</Text></View><TouchableOpacity style={styles.composeButton} accessibilityLabel="Start new chat"><Text style={styles.composeIcon}>＋</Text></TouchableOpacity></View>
      <View style={styles.searchBox}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search contacts" placeholderTextColor="#9A9AAF" style={styles.searchInput} /></View>
      <Text style={styles.sectionTitle}>RECENT CHATS</Text><FlatList data={filteredContacts} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} renderItem={({item}) => <TouchableOpacity activeOpacity={0.78} onPress={() => setActiveContact(item)} style={styles.contact}><Avatar contact={item} /><View style={styles.contactText}><Text style={styles.contactName}>{item.name}</Text><Text style={styles.message} numberOfLines={1}>{item.message}</Text></View><View style={styles.meta}><Text style={styles.time}>{item.time}</Text>{!!item.unread && <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>}</View></TouchableOpacity>} ListEmptyComponent={<Text style={styles.empty}>No contacts found</Text>} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F8F8FC'}, container: {flex: 1, paddingHorizontal: 20}, header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, paddingBottom: 23}, greeting: {fontSize: 30, lineHeight: 37, fontWeight: '800', color: '#20212D', letterSpacing: -0.6}, subtitle: {fontSize: 14, color: '#77798B', marginTop: 3}, composeButton: {width: 46, height: 46, borderRadius: 23, backgroundColor: '#665CF6', alignItems: 'center', justifyContent: 'center'}, composeIcon: {fontSize: 27, lineHeight: 29, color: '#FFF'}, searchBox: {height: 52, backgroundColor: '#EEEEF5', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 27}, searchIcon: {fontSize: 28, color: '#77798B', marginRight: 9}, searchInput: {flex: 1, height: '100%', color: '#222330', fontSize: 16}, sectionTitle: {fontSize: 12, letterSpacing: 1.1, color: '#9192A2', fontWeight: '700', marginBottom: 7}, list: {paddingBottom: 24}, contact: {minHeight: 78, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderRadius: 17, marginBottom: 4}, avatar: {height: 54, width: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginRight: 14}, initials: {color: '#FFF', fontWeight: '700', fontSize: 16}, onlineDot: {position: 'absolute', right: 0, bottom: 1, width: 14, height: 14, borderRadius: 7, backgroundColor: '#45C783', borderWidth: 2, borderColor: '#F8F8FC'}, contactText: {flex: 1, minWidth: 0}, contactName: {fontSize: 16, fontWeight: '700', color: '#292A36', marginBottom: 5}, message: {fontSize: 14, color: '#858697'}, meta: {alignSelf: 'stretch', alignItems: 'flex-end', paddingVertical: 14, minWidth: 52}, time: {fontSize: 12, color: '#999AAA'}, badge: {minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, marginTop: 6, backgroundColor: '#665CF6', alignItems: 'center', justifyContent: 'center'}, badgeText: {color: '#FFF', fontSize: 11, fontWeight: '700'}, empty: {textAlign: 'center', color: '#858697', marginTop: 40, fontSize: 15},
  chatContainer: {flex: 1}, chatHeader: {height: 76, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9E9F0', backgroundColor: '#FFF'}, backButton: {width: 36, height: 50, justifyContent: 'center'}, backIcon: {fontSize: 42, color: '#38374C', fontWeight: '300', marginTop: -5}, chatTitle: {flex: 1}, chatName: {fontSize: 16, fontWeight: '800', color: '#262637'}, presence: {fontSize: 13, color: '#45B97C', marginTop: 2}, callButton: {width: 34, height: 34, borderRadius: 17, backgroundColor: '#258ED7', justifyContent: 'center', alignItems: 'center', marginHorizontal: 3}, phoneIcon: {width: 18, height: 18, transform: [{rotate: '-42deg'}]}, phoneGrip: {position: 'absolute', width: 16, height: 6, borderRadius: 4, backgroundColor: '#FFF', left: 1, top: 6}, phoneEnd: {position: 'absolute', width: 7, height: 9, borderRadius: 2, backgroundColor: '#FFF'}, phoneTop: {left: 0, top: 1}, phoneBottom: {right: 0, bottom: 1}, moreButton: {width: 28, height: 44, justifyContent: 'center', alignItems: 'center'}, moreIcon: {fontSize: 25, color: '#5E5F70'}, messageList: {paddingHorizontal: 16, paddingBottom: 18, paddingTop: 12}, dayPill: {alignSelf: 'center', overflow: 'hidden', backgroundColor: '#E8E7F0', color: '#777789', fontSize: 10, fontWeight: '700', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 10, marginBottom: 18}, bubble: {maxWidth: '79%', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 7, borderRadius: 18, marginBottom: 8}, theirBubble: {alignSelf: 'flex-start', backgroundColor: '#A8E66B', borderBottomLeftRadius: 5}, myBubble: {alignSelf: 'flex-end', backgroundColor: '#665CF6', borderBottomRightRadius: 5}, bubbleText: {fontSize: 16, lineHeight: 21, color: '#29293A'}, myBubbleText: {color: '#FFF'}, bubbleTime: {fontSize: 10, color: '#9090A0', textAlign: 'right', marginTop: 4}, myBubbleTime: {color: '#DCD9FF'}, composer: {minHeight: 76, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E9E9F0'}, attachButton: {width: 38, alignItems: 'center'}, attachIcon: {fontSize: 25, color: '#77778B'}, messageInput: {flex: 1, minHeight: 45, maxHeight: 90, backgroundColor: '#F0F0F5', borderRadius: 23, paddingHorizontal: 16, color: '#29293A', fontSize: 16}, sendButton: {width: 45, height: 45, borderRadius: 23, marginLeft: 10, backgroundColor: '#665CF6', alignItems: 'center', justifyContent: 'center'}, sendButtonMuted: {backgroundColor: '#B9B6D6'}, sendIcon: {fontSize: 19, color: '#FFF', marginLeft: 2},
  callScreen: {flex: 1, backgroundColor: '#24203C'}, callContent: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 110}, largeAvatar: {height: 128, width: 128, borderRadius: 64, marginRight: 0}, largeInitials: {fontSize: 38}, callName: {fontSize: 28, fontWeight: '800', color: '#FFF', marginTop: 24}, callState: {fontSize: 16, color: '#C6C1E7', marginTop: 8}, endCall: {position: 'absolute', bottom: 70, alignSelf: 'center', height: 64, width: 64, borderRadius: 32, backgroundColor: '#F25364', alignItems: 'center', justifyContent: 'center'}, endCallIcon: {color: '#FFF', fontSize: 28},
});

export default App;
