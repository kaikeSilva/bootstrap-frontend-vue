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

## VUE.JS 3 SPECIFIC GUIDELINES

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