import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JournalScreen from './screens/JournalScreen';
import InsightScreen from './app/(tabs)/insights';
import GalaxyScreen from './screens/GalaxyScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="Insights" component={InsightScreen} />
        <Tab.Screen name="Galaxy" component={GalaxyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
