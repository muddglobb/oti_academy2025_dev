import fs from 'fs/promises';
import path from 'path';
import logger from './logger.js';

/**
 * Template utilities to help with loading and processing email templates
 */
class TemplateUtil {
  private readonly templatesDir: string;

  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
  }

  /**
   * Load a template file from the templates directory
   * 
   * @param templatePath Path to the template relative to templates directory
   * @returns Template content as string
   */
  public async loadTemplate(templatePath: string): Promise<string> {
    try {
      const fullPath = path.join(this.templatesDir, templatePath);
      return await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      logger.error(`Failed to load template at ${templatePath}:`, error);
      throw new Error(`Template loading failed: ${(error as Error).message}`);
    }
  }

  /**
   * Replace template variables with provided values
   * 
   * @param template Template string with variables in {{variable}} format
   * @param variables Object with variable names and values
   * @returns Processed template with variables replaced
   */
  public replaceVariables(template: string, variables: Record<string, any> = {}): string {
    let result = template;
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    }
    
    // Remove any unused variables
    result = result.replace(/{{.*?}}/g, '');
    
    return result;
  }

  /**
   * Combine base template with content
   * 
   * @param baseTemplatePath Path to base template
   * @param content Content to insert into base template
   * @param variables Template variables
   * @returns Processed complete template
   */
  public async composeTemplate(
    baseTemplatePath: string, 
    content: string, 
    variables: Record<string, any> = {}
  ): Promise<string> {
    try {
      // Load base template
      const baseTemplate = await this.loadTemplate(baseTemplatePath);
      
      // Insert content into base template
      let result = baseTemplate.replace('{{content}}', content);
      
      // Replace variables
      result = this.replaceVariables(result, variables);
      
      return result;
    } catch (error) {
      logger.error('Failed to compose template:', error);
      throw new Error(`Template composition failed: ${(error as Error).message}`);
    }
  }
}

export default new TemplateUtil();
