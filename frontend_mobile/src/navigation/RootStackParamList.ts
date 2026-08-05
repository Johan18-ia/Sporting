// src/navigation/RootStackParamList.ts
import { User } from '../domain/entities/User';

export type RootStackParamList = {
    // Public
    Home: undefined;

    // Auth
    Login: undefined;
    Register: undefined;
    
    // Main
    MainTabs: undefined;
    
    // Dashboard
    Dashboard: undefined;
    
    // Users
    Users: undefined;
    UserDetail: { userId: number };
    UserForm: { user?: User; mode: 'create' | 'edit' };
    
    // Categories
    Categories: undefined;
    
    // Schedules
    Schedules: undefined;
    
    // Products
    Products: undefined;
    
    // Students
    Students: undefined;
    StudentForm: { student?: any; mode: 'create' | 'edit' };
    
    // Tournaments
    Tournaments: undefined;
    
    // Teams
    Teams: undefined;
    
    // Reports
    Reports: undefined;
    
    // Profile
    Profile: undefined;
};