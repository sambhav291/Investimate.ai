# Azure App Service Deployment Guide

This guide explains how to deploy the Investimate.ai backend to Azure App Service using GitHub Deployment Center.

## Pre-Deployment Checklist

Before deployment, ensure that:

- [x] `application.py` is properly configured as the entry point
- [x] `web.config` is set up to use the correct Python path and arguments
- [x] `requirements.txt` includes all necessary dependencies
- [x] `runtime.txt` specifies the correct Python version (3.11.9)
- [x] `.deployment` file is properly configured
- [x] `startup.sh` is set up correctly

## Deployment Steps

1. **Log in to the Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)

2. **Create a new App Service or select an existing one**
   - Choose "App Service" from the Azure services
   - Create a new App Service or select an existing one
   - Make sure to select "Python" as the runtime stack

3. **Configure Deployment Center**
   - Go to your App Service resource
   - Select "Deployment Center" from the left menu
   - Choose "GitHub" as the source
   - Authenticate with your GitHub account
   - Select the repository: `sambhav291/Investimate.ai`
   - Select the branch: `main`
   - For workflow option:
     - Select "Add a workflow" (Azure will generate a new GitHub Actions workflow file)
     - If you see "Use existing workflow," do **not** select it, as none of your existing workflows are configured for Azure deployment
   - Choose "App Service build service" as the build provider

4. **Configure Build Provider**
   - Runtime Stack: Python
   - Version: 3.11
   - Build Command: `pip install -r requirements.txt`
   - Startup Command: `startup.sh` (this will execute the commands in the startup.sh script)

5. **Configure Application Settings**
   - Go to "Configuration" in your App Service
   - Under "General settings" tab:
     - Ensure that the "Startup Command" field is **empty** (to avoid conflicts with the startup command specified in Deployment Center)
   - Under "Application settings" tab:
     - Add environment variables:
       - `PYTHONPATH`: `/home/site/wwwroot`
       - Any other environment variables required by your application

6. **Deploy**
   - Click "Save" to start the deployment process
   - Monitor the deployment logs in the Deployment Center

## Post-Deployment Checks

After deployment:

1. **Check Logs**
   - Go to "Log stream" in your App Service to monitor startup logs
   - Verify that your application started successfully

2. **Test the API**
   - Use the App Service URL to test your API endpoints
   - Verify that all functionality works as expected

3. **Monitor Performance**
   - Use "Application Insights" (if configured) to monitor performance
   - Check "Metrics" for CPU, memory, and request performance

## Troubleshooting

If you encounter issues:

1. **Check Application Logs**
   - Go to "Logs" in your App Service
   - Look for error messages in the startup logs
   
   > **Note**: This application has startup commands defined in both `web.config` and `startup.sh`. The startup command priority is:
   > 1. General Settings in Azure Portal (highest priority) - should be kept empty
   > 2. Deployment Center startup command (`startup.sh`) - this is what we use
   > 3. Command in `web.config` (fallback if others aren't specified)

2. **Check Deployment Logs**
   - Go to "Deployment Center" > "Logs"
   - Look for issues during the deployment process

3. **Common Issues**
   - **Dependencies not installed:** Check if all dependencies are in `requirements.txt`
   - **Startup failures:** Check `startup.sh` and `web.config`
   - **Import errors:** Check if all required modules are available
   - **Multiple startup commands:** Ensure the General Settings startup command is empty, and only the Deployment Center startup command (`startup.sh`) is specified

## Maintenance

1. **Updates**
   - Push changes to your GitHub repository
   - Azure will automatically redeploy the application using the generated GitHub Actions workflow
   - The workflow file will be created in `.github/workflows/main_your-app-service-name.yml`

2. **GitHub Actions Workflow**
   - After the first deployment, review the generated workflow file in your repository
   - You can customize it as needed for more advanced deployment scenarios
   - Your existing workflow files (`deploy.yml`, `azure-deploy.yml`, `main_investimate-backend.yml`) will not be used for Azure deployment

3. **Scaling**
   - Use "Scale up" and "Scale out" options in your App Service to adjust resources

3. **Monitoring**
   - Set up alerts in "Monitoring" to be notified of issues
