// MINIMAL COST Bicep template for Investimate Backend deployment
// Optimized for Azure for Students ($100 credit) - FREE TIER ONLY
// Total Cost: $0.00/month

targetScope = 'resourceGroup'

// ============================================
// PARAMETERS
// ============================================
@minLength(1)
@maxLength(64)
@description('Name of the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Resource group name for the application')
param resourceGroupName string

@description('Name of the App Service')
param appName string = ''

// Environment variables - stored directly in app settings (no Key Vault)
@secure()
@description('Secret key for the application')
param secretKey string

@secure()
@description('Google OAuth Client ID')
param googleClientId string

@secure()
@description('Google OAuth Client Secret')
param googleClientSecret string

@secure()
@description('Database URL (Supabase PostgreSQL)')
param databaseUrl string

@secure()
@description('Supabase URL')
param supabaseUrl string

@secure()
@description('Supabase service key')
param supabaseKey string

@description('Supabase bucket name')
param supabaseBucket string

@description('Environment (production/development)')
param environment string = 'production'

@description('Debug mode (true/false)')
param debug string = 'false'

@description('CORS origins (comma-separated)')
param corsOrigins string = 'https://investimate-ai-eight.vercel.app'

// ============================================
// VARIABLES
// ============================================
var resourceToken = toLower(uniqueString(subscription().id, resourceGroup().id, environmentName))
var prefix = '${environmentName}-${resourceToken}'
var tags = { 
  'azd-env-name': environmentName,
  'application': 'investimate-backend',
  'environment': environment
}

// Resource names using the resource token pattern
var appServicePlanName = 'asp-${prefix}'
var appServiceName = !empty(appName) ? appName : 'app-${prefix}'
var userAssignedManagedIdentityName = 'id-${prefix}'

// ============================================
// USER ASSIGNED MANAGED IDENTITY (FREE)
// ============================================
resource userAssignedManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: userAssignedManagedIdentityName
  location: location
  tags: tags
}

// ============================================
// FREE TIER APP SERVICE PLAN
// ============================================
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: 'F1'      // FREE TIER - $0 cost
    tier: 'Free'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux App Service Plans
  }
}

// ============================================
// APP SERVICE (FREE TIER)
// ============================================
resource appService 'Microsoft.Web/sites@2024-04-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  tags: union(tags, {
    'azd-service-name': 'investimate-backend'
  })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedManagedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'PYTHON|3.11'
      alwaysOn: false  // Not available on Free tier
      httpLoggingEnabled: false  // Minimize logging to save space
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      use32BitWorkerProcess: false
      healthCheckPath: '/health'
      appCommandLine: 'python -m uvicorn main:app --host 0.0.0.0 --port 8000'
      cors: {
        allowedOrigins: split(corsOrigins, ',')
        supportCredentials: true
      }
      appSettings: [
        {
          name: 'ENVIRONMENT'
          value: environment
        }
        {
          name: 'DEBUG'
          value: debug
        }
        {
          name: 'CORS_ORIGINS'
          value: corsOrigins
        }
        {
          name: 'SECRET_KEY'
          value: secretKey
        }
        {
          name: 'GOOGLE_CLIENT_ID'
          value: googleClientId
        }
        {
          name: 'GOOGLE_CLIENT_SECRET'
          value: googleClientSecret
        }
        {
          name: 'GOOGLE_REDIRECT_URI'
          value: 'https://${appServiceName}.azurewebsites.net/auth/google/callback'
        }
        {
          name: 'DATABASE_URL'
          value: databaseUrl
        }
        {
          name: 'SUPABASE_URL'
          value: supabaseUrl
        }
        {
          name: 'SUPABASE_KEY'
          value: supabaseKey
        }
        {
          name: 'SUPABASE_BUCKET'
          value: supabaseBucket
        }
      ]
    }
  }
}

// ============================================
// OUTPUTS
// ============================================
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroupName
output RESOURCE_GROUP_ID string = resourceGroup().id
output SERVICE_INVESTIMATE_BACKEND_NAME string = appService.name
output SERVICE_INVESTIMATE_BACKEND_ENDPOINT_URL string = 'https://${appService.properties.defaultHostName}'
