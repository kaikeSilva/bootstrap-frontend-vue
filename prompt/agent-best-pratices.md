# AGENT SAFETY GUIDELINES - Vue.js 3 Docker Development

## CRITICAL DECISION MAKING HIERARCHY

### 1. ALWAYS TRY FIRST - Agent Capabilities
**YOU MUST ATTEMPT THESE ACTIONS BEFORE REQUESTING DEVELOPER HELP:**

- **File Creation/Editing**: Try to create/edit Vue components, TypeScript files, and configurations
- **Directory Creation**: Try creating folders for components, composables, stores, and services
- **Code Writing**: Write complete Vue 3 components, composables, and TypeScript classes
- **Package Management**: Add dependencies and modify package.json
- **Build Configuration**: Modify vite.config.ts, tsconfig.json, and environment files

### 2. PREFER VUE 3 + VITE COMMANDS - Framework First Approach
**WHEN POSSIBLE, USE VUE/VITE COMMANDS OVER MANUAL CREATION:**

```bash
# PREFERRED: Use Vue 3 + Vite commands
npm create vue@latest project-name
npm install package-name
npm run build
npm run dev
npm run type-check
npm run lint

# DOCKER PREFERRED: Execute through container
docker compose exec vue-app npm install package-name
docker compose exec vue-app npm run build
docker compose exec vue-app npm run type-check

# FALLBACK: Only use manual creation if npm commands fail
mkdir src/components/NewFeature
touch src/components/NewFeature/Component.vue
```

### 3. DOCKER COMMAND EXECUTION
**ALWAYS ATTEMPT DOCKER COMMANDS DIRECTLY:**

```bash
# TRY THESE FIRST
docker compose exec vue-app npm install
docker compose exec vue-app npm run build  
docker compose exec vue-app npm run type-check
docker compose exec vue-app npm run lint
docker compose ps
docker compose logs vue-app
docker compose up --build
```

### 4. ONLY REQUEST HELP WHEN EXPLICITLY BLOCKED
**REQUEST DEVELOPER ACTION ONLY WHEN YOU RECEIVE EXPLICIT ERROR MESSAGES:**

- ✅ "Permission denied"
- ✅ "Cannot edit file in .gitignore" 
- ✅ "Access denied to container"
- ✅ "Command not found"
- ✅ "File is read-only"
- ✅ "EACCES: permission denied"
- ✅ "Module not found" (after install attempts)

**DO NOT REQUEST HELP FOR:**
- ❌ Components you haven't tried to create
- ❌ Dependencies you haven't attempted to install
- ❌ Directories you haven't tried to create
- ❌ Standard Vue.js operations
- ❌ Build errors you haven't attempted to resolve

## TYPESCRIPT FUNDAMENTALS FOR VUE.JS 3

### Basic TypeScript Concepts
**ESSENTIAL TYPESCRIPT KNOWLEDGE FOR VUE DEVELOPMENT:**

#### 1. Type Annotations and Interfaces
```typescript
// Basic types
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;
const items: string[] = ['a', 'b', 'c'];
const user: User | null = null;

// Interface definition
interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user'; // Optional with union types
}

// Type alias
type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};
```

#### 2. Vue 3 Component Typing
```vue
<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';

// Props with TypeScript
interface Props {
  title: string;
  count?: number;
  items: string[];
  user?: User;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],
});

// Reactive refs with explicit typing
const isLoading: Ref<boolean> = ref(false);
const users: Ref<User[]> = ref([]);

// Or use type inference (preferred when obvious)
const message = ref(''); // inferred as Ref<string>
const total = ref(0);    // inferred as Ref<number>

// Computed with typing
const activeUsers = computed((): User[] => {
  return users.value.filter(u => u.role === 'admin');
});

// Function typing
const handleSubmit = async (data: FormData): Promise<void> => {
  isLoading.value = true;
  try {
    // API call
  } catch (error: unknown) {
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Event emits typing
const emit = defineEmits<{
  update: [value: string];
  submit: [data: User];
  close: [];
}>();
</script>
```

#### 3. Common TypeScript Errors and Solutions

**ERROR: "Type 'unknown' is not assignable to type 'string'"**
```typescript
// ❌ WRONG
const handleError = (error: unknown) => {
  console.log(error.message); // Error!
};

// ✅ CORRECT - Type guard
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message); // Safe
  }
  // Or type assertion if you're sure
  console.log((error as Error).message);
};
```

**ERROR: "Object is possibly 'null' or 'undefined'"**
```typescript
// ❌ WRONG
const user = ref<User | null>(null);
console.log(user.value.name); // Error!

// ✅ CORRECT - Optional chaining
console.log(user.value?.name);

// ✅ CORRECT - Type guard
if (user.value) {
  console.log(user.value.name); // Safe
}
```

**ERROR: "Property 'xyz' does not exist on type"**
```typescript
// ❌ WRONG - Missing property in interface
interface User {
  name: string;
}
const user: User = { name: 'John', age: 30 }; // Error!

// ✅ CORRECT - Add property to interface
interface User {
  name: string;
  age: number;
}

// ✅ CORRECT - Optional property
interface User {
  name: string;
  age?: number; // Optional
}
```

#### 4. API and Service Typing
```typescript
// Service with proper typing
export class ApiService {
  static async fetchUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch('/api/users');
      const data: ApiResponse<User[]> = await response.json();
      return data;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    return response.json() as Promise<User>;
  }
}
```

#### 5. Composable Typing Patterns
```typescript
// Composable with proper return typing
export function useApi<T>(url: string) {
  const data: Ref<T | null> = ref(null);
  const loading = ref(false);
  const error: Ref<string | null> = ref(null);

  const fetch = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ApiService.get<T>(url);
      data.value = response.data;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading.value = false;
    }
  };

  return {
    data: readonly(data),
    loading: readonly(loading), 
    error: readonly(error),
    fetch,
  } as const; // Ensure return type is inferred correctly
}

// Usage with proper typing
const { data: users, loading, error, fetch } = useApi<User[]>('/api/users');
```

### TypeScript Configuration Best Practices

#### 1. tsconfig.json Essential Settings
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx", 
    "src/**/*.vue"
  ],
  "exclude": ["node_modules"]
}
```

#### 2. Vue Component Type Declaration
```typescript
// src/types/vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Global type declarations
declare global {
  interface Window {
    // Add global properties if needed
    gtag?: (...args: any[]) => void;
  }
}
```

### Common Build Error Patterns and Solutions

#### 1. Import/Export Issues
```typescript
// ❌ WRONG - Missing file extensions in some cases
import { useUser } from '@/composables/useUser';

// ✅ CORRECT - Always use proper imports for Vue
import { useUser } from '@/composables/useUser';
// Vite handles this correctly

// ❌ WRONG - Default export issues
export const useAuth = () => { /* ... */ };
import useAuth from '@/composables/useAuth'; // Error!

// ✅ CORRECT - Consistent export/import
export const useAuth = () => { /* ... */ };
import { useAuth } from '@/composables/useAuth';

// OR
export default function useAuth() { /* ... */ }
import useAuth from '@/composables/useAuth';
```

#### 2. Reactive Type Issues
```typescript
// ❌ WRONG - Lost reactivity
const state = reactive({
  user: null as User | null,
  items: [] as Item[],
});

// Later assignment loses typing
state.user = fetchedUser; // May cause type issues

// ✅ CORRECT - Proper reactive typing
interface State {
  user: User | null;
  items: Item[];
}

const state: State = reactive({
  user: null,
  items: [],
});

// ✅ CORRECT - Or use refs for better type safety
const user = ref<User | null>(null);
const items = ref<Item[]>([]);
```

### TypeScript Debugging Strategies

#### 1. Using Type Assertions Safely
```typescript
// ❌ DANGEROUS - Unsafe type assertion
const data = response as User; // Could be wrong!

// ✅ BETTER - Type guard function
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

const data = response;
if (isUser(data)) {
  // Now data is safely typed as User
  console.log(data.name);
}

// ✅ GOOD - Runtime validation with libraries like zod
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

const userData = UserSchema.parse(response); // Validates at runtime
```

#### 2. Handling Generic Components
```vue
<!-- Generic component typing -->
<script setup lang="ts" generic="T">
interface Props<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => string;
}

const props = defineProps<Props<T>>();

// Usage maintains type safety
const displayItems = computed(() => {
  return props.items.map(item => ({
    key: props.keyExtractor(item),
    display: props.renderItem(item),
  }));
});
</script>
```

### Error Troubleshooting Checklist

**WHEN ENCOUNTERING TYPE ERRORS:**

1. **Check Interface Definitions**
   ```bash
   # Verify your interfaces match the actual data
   console.log('Actual data:', JSON.stringify(data, null, 2));
   ```

2. **Verify Import/Export Consistency**
   ```typescript
   // Check if you're importing the right type
   import type { User } from '@/types'; // Type-only import
   import { User } from '@/types';      // Value import
   ```

3. **Use Type Utilities**
   ```typescript
   // Built-in TypeScript utilities
   type PartialUser = Partial<User>;      // All properties optional
   type UserName = Pick<User, 'name'>;    // Only 'name' property
   type CreateUser = Omit<User, 'id'>;    // Exclude 'id' property
   type UserKeys = keyof User;            // Union of all keys
   ```

4. **Enable Strict Type Checking Gradually**
   ```json
   // In tsconfig.json - enable one by one if errors are overwhelming
   {
     "compilerOptions": {
       "strict": false,           // Start here
       "noImplicitAny": true,     // Enable gradually
       "strictNullChecks": true,  // Then this
       "noImplicitReturns": true  // Finally this
     }
   }
   ```

**TYPESCRIPT BUILD VERIFICATION COMMANDS:**

```bash
# Always run these before requesting help
docker compose exec vue-app npm run type-check
docker compose exec vue-app npx vue-tsc --noEmit
docker compose exec vue-app npm run build

# Check specific file types
docker compose exec vue-app npx tsc --noEmit --skipLibCheck src/components/MyComponent.vue
```

**REMEMBER**: TypeScript errors are often about missing types, incorrect interfaces, or unsafe operations. Always read the error message carefully and understand what TypeScript is trying to protect you from!

### Framework Knowledge (Vue 3 + TypeScript + Vite)
**USE VUE 3 CONVENTIONS AND MODERN FEATURES:**

- **Composition API**: Use `<script setup>` syntax primarily
- **TypeScript**: Use proper typing with interfaces and types  
- **Reactive References**: Use `ref()`, `reactive()`, `computed()`
- **Lifecycle Hooks**: Use `onMounted()`, `onUnmounted()`, etc.
- **Component Structure**: Use Single File Components (.vue)
- **State Management**: Use Pinia for global state
- **Routing**: Use Vue Router 4 with TypeScript
- **Build Tool**: Use Vite for development and building

### Directory Structure (Vue 3 + TypeScript)
**FOLLOW STANDARD VUE 3 PROJECT CONVENTIONS:**

```
src/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── composables/
├── stores/
├── services/
├── types/
├── utils/
├── views/
├── router/
├── assets/
└── styles/
public/
├── favicon.ico
└── ...
```

### Package Management Priority
**ALWAYS PREFER NPM COMMANDS OVER MANUAL EDITING:**

```bash
# CORRECT APPROACH
1. Try: docker compose exec vue-app npm install @vueuse/core
2. Try: docker compose exec vue-app npm install -D @types/node
3. If fails: Then manually edit package.json

# WRONG APPROACH  
1. Immediately ask developer to run npm install
2. Edit package.json without trying npm commands first
```

## CONTAINER-SPECIFIC EXECUTION RULES

### Vue App Container Commands
**EXECUTE DIRECTLY IN VUE CONTAINER:**

```bash
# YOU SHOULD RUN THESE YOURSELF
docker compose exec vue-app npm install
docker compose exec vue-app npm run build
docker compose exec vue-app npm run dev
docker compose exec vue-app npm run type-check
docker compose exec vue-app npm run lint
docker compose exec vue-app npm run test
docker compose exec vue-app vue-tsc --noEmit
```

### Build and Development Commands
**EXECUTE DIRECTLY:**

```bash
# YOU SHOULD RUN THESE YOURSELF
docker compose up --build
docker compose exec vue-app npm run preview
docker compose logs vue-app
docker compose restart vue-app
```

### File System Operations
**EXECUTE DIRECTLY:**

```bash
# YOU SHOULD RUN THESE YOURSELF
docker compose exec vue-app ls -la src/
docker compose exec vue-app find src/ -name "*.vue"
docker compose exec vue-app cat package.json
```

## WHEN TO REQUEST DEVELOPER HELP

### File Access Issues
**ONLY REQUEST HELP WHEN YOU GET EXPLICIT ERRORS:**

```
✅ REQUEST HELP FOR:
- "edit_file tool cannot modify files in .gitignore"
- "Permission denied when writing to file"
- "Cannot create directory: permission denied"
- "EACCES: permission denied, open '/app/package.json'"

❌ DON'T REQUEST HELP FOR:
- Components you haven't tried to create
- Files you haven't attempted to modify
- Dependencies you haven't tried to install
```

### Environment Configuration
**TRY TO READ/MODIFY ENVIRONMENT FILES FIRST:**

```bash
# TRY FIRST
1. Read current .env files (.env, .env.local, .env.production)
2. Attempt to modify environment files
3. Check vite.config.ts configuration
4. Only if blocked, then request developer help
```

### Package Installation
**ATTEMPT NPM COMMANDS FIRST:**

```bash
# TRY FIRST
1. docker compose exec vue-app npm install package-name
2. Check if package was added to package.json
3. Verify node_modules directory
4. Only if installation fails, then request developer help
```

## VUE.JS 3 CODE STANDARDS

### Component Structure (Composition API)
```vue
<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ComponentProps } from '@/types';

// Props definition
interface Props {
  title: string;
  items?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});

// Reactive state
const isLoading = ref(false);
const data = ref<any[]>([]);

// Computed properties
const filteredData = computed(() => {
  return data.value.filter(item => item.active);
});

// Lifecycle
onMounted(() => {
  // Component logic
});

// Methods
const handleClick = () => {
  // Method implementation
};
</script>

<style scoped>
.component-name {
  /* Component styles */
}
</style>
```

### Composable Structure
```typescript
// src/composables/useFeature.ts
import { ref, computed } from 'vue';

export function useFeature() {
  const state = ref(null);
  const isLoading = ref(false);

  const computedValue = computed(() => {
    return state.value ? 'loaded' : 'empty';
  });

  const fetchData = async () => {
    isLoading.value = true;
    try {
      // Async logic
    } finally {
      isLoading.value = false;
    }
  };

  return {
    state,
    isLoading,
    computedValue,
    fetchData,
  };
}
```

### Pinia Store Structure
```typescript
// src/stores/feature.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFeatureStore = defineStore('feature', () => {
  // State
  const items = ref<Item[]>([]);
  const isLoading = ref(false);

  // Getters
  const activeItems = computed(() => {
    return items.value.filter(item => item.active);
  });

  // Actions
  const fetchItems = async () => {
    isLoading.value = true;
    try {
      // API call logic
    } finally {
      isLoading.value = false;
    }
  };

  return {
    items,
    isLoading,
    activeItems,
    fetchItems,
  };
});
```

### TypeScript Interface Structure
```typescript
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export type ComponentProps = {
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};
```

## TESTING AND VERIFICATION APPROACH

### Self-Verification First
**VERIFY YOUR OWN WORK BEFORE REQUESTING HELP:**

1. ✅ Check if components render without errors
2. ✅ Verify TypeScript compilation passes
3. ✅ Test component props and events
4. ✅ Check browser console for errors
5. ✅ Verify Vite build succeeds
6. ❌ Don't immediately ask developer to verify

### Build Verification
**ALWAYS CHECK BUILD SUCCESS:**

```bash
# VERIFY BUILD WORKS
1. docker compose exec vue-app npm run build
2. Check dist/ directory was created
3. Verify no TypeScript errors
4. Check for console warnings
```

### Type Checking
**ALWAYS VERIFY TYPESCRIPT:**

```bash
# VERIFY TYPES
1. docker compose exec vue-app npm run type-check
2. Check for TypeScript errors
3. Verify component props are typed
4. Ensure imports are correct
```

## DOCKERFILE AND DOCKER COMPOSE GUIDELINES

### Multi-Stage Build Understanding
**UNDERSTAND BUILD PROCESS:**

```dockerfile
# Development stage
FROM node:18-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage  
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Service Configuration
**UNDERSTAND SERVICE STRUCTURE:**

```yaml
version: '3.8'
services:
  vue-app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development  # or production
    ports:
      - "5173:5173"      # dev server
      - "3000:80"        # production
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:8000
    volumes:
      - .:/app           # development only
      - /app/node_modules
```

## COMMON TASKS AND APPROACHES

### Adding New Dependencies
**PREFERRED APPROACH:**

```bash
# 1. Try npm install in container
docker compose exec vue-app npm install @vueuse/core

# 2. If container not running, start it first
docker compose up -d vue-app
docker compose exec vue-app npm install @vueuse/core

# 3. Verify installation
docker compose exec vue-app npm list @vueuse/core
```

### Creating New Components
**PREFERRED APPROACH:**

```bash
# 1. Try creating component file
mkdir -p src/components/NewFeature
# Create Component.vue file with proper structure

# 2. Add to components/index.ts if exists
# 3. Import in parent component
# 4. Test component renders correctly
```

### Environment Variables
**PREFERRED APPROACH:**

```bash
# 1. Try reading current .env files
cat .env
cat .env.local

# 2. Add new environment variables
echo "VITE_NEW_VAR=value" >> .env.local

# 3. Restart container if needed
docker compose restart vue-app
```

### Build Issues
**TROUBLESHOOTING APPROACH:**

```bash
# 1. Check for TypeScript errors
docker compose exec vue-app npm run type-check

# 2. Check for linting issues  
docker compose exec vue-app npm run lint

# 3. Try clean build
docker compose exec vue-app rm -rf dist
docker compose exec vue-app npm run build

# 4. Check for dependency issues
docker compose exec vue-app npm audit
```

## FINAL EXECUTION PRINCIPLES

### Independence First
- **TRY**: Always attempt the action yourself first
- **BUILD**: Ensure your changes don't break the build
- **TYPE-CHECK**: Verify TypeScript compilation
- **TEST**: Check components render properly
- **REQUEST**: Only ask for help when truly blocked

### Framework Preference  
- **COMPOSITION API**: Use `<script setup>` and Composition API
- **TYPESCRIPT**: Proper typing for all components and functions
- **VITE**: Use Vite commands for building and development
- **MODERN PRACTICES**: Follow Vue 3 best practices

### Docker Awareness
- **CONTAINER CONTEXT**: Know when to use vue-app container
- **DIRECT EXECUTION**: Execute npm and build commands directly
- **VOLUME MOUNTS**: Understand development vs production mounts
- **PORT MAPPING**: Know which ports are exposed

### Communication Clarity
- **SPECIFIC ERRORS**: Only report actual error messages
- **ATTEMPTED ACTIONS**: List what you've tried before requesting help
- **BUILD STATUS**: Always mention if build succeeds or fails
- **TYPESCRIPT STATUS**: Report any type checking errors

### Vue.js Specific Best Practices
- **Component Naming**: Use PascalCase for component files
- **Prop Validation**: Always define prop types with TypeScript
- **Event Handling**: Use proper event naming conventions
- **Style Scoping**: Use scoped styles in components
- **Performance**: Consider `v-memo`, `shallowRef` for optimization

**REMEMBER**: Your goal is to be as independent as possible while following Vue 3, TypeScript, and Docker best practices. Request developer help only when you encounter actual technical barriers, not as a first resort. Always verify your changes work by checking the build process and TypeScript compilation.