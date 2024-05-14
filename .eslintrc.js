module.exports = {
  root: true,
  extends: [
    '@react-native',                           // Configuration de base pour React Native
    'plugin:@typescript-eslint/recommended',  // Recommandations pour TypeScript
    'plugin:react-hooks/recommended',         // Recommandations pour les hooks React
    'plugin:prettier/recommended',            // Intégration de Prettier avec ESLint
  ],
  parser: '@typescript-eslint/parser',         // Utilisation du parser TypeScript pour ESLint
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    // Ajoutez ou modifiez les règles selon vos préférences
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // Désactiver si vous ne voulez pas définir explicitement les types de retour pour chaque fonction
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // Ignorer les variables commençant par _
    'prettier/prettier': ['error', { endOfLine: 'auto' }],  // Assurer la compatibilité avec différents systèmes d'exploitation
  },
  settings: {
    react: {
      version: 'detect',  // Détecter automatiquement la version de React
    },
  },
};
