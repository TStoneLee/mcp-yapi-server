#!/usr/bin/env node

/**
 * MCP YApi Server
 * 
 * 一个基于Model Context Protocol (MCP)的YApi集成服务器
 * 提供查询YApi API文档的工具,支持在Cursor等MCP兼容编辑器中使用
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * YApi客户端类
 * 负责与YApi服务端通信,获取API文档数据
 */
class YApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = process.env.YAPI_BASE_URL || 'https://yapi.example.com') {
    this.baseUrl = baseUrl;
    this.token = process.env.YAPI_TOKEN;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // YApi 不需要在 header 中添加 token
    // token 会作为 query 参数传递
  }

  /**
   * 设置认证令牌
   */
  setAuthToken(token: string): void {
    this.token = token;
  }

  /**
   * 获取接口详情
   */
  async getInterfaceDetails(interfaceId: string, token?: string): Promise<any> {
    try {
      const params: any = { id: interfaceId };
      
      // 优先使用传入的 token，其次使用实例的 token
      const finalToken = token || this.token;
      if (finalToken) {
        params.token = finalToken;
      }

      const response = await this.client.get('/api/interface/get', { params });

      if (response.data.errcode !== 0) {
        throw new Error(response.data.errmsg || '获取接口详情失败');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error, '获取接口详情失败');
    }
  }

  /**
   * 获取项目信息
   */
  async getProjectInfo(projectId: string, token?: string): Promise<any> {
    try {
      const params: any = { id: projectId };
      
      // 优先使用传入的 token，其次使用实例的 token
      const finalToken = token || this.token;
      if (finalToken) {
        params.token = finalToken;
      }

      const response = await this.client.get('/api/project/get', { params });

      if (response.data.errcode !== 0) {
        throw new Error(response.data.errmsg || '获取项目信息失败');
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error, '获取项目信息失败');
    }
  }

  /**
   * 获取接口列表
   */
  async getInterfaceList(projectId: string, catId?: string, token?: string): Promise<any[]> {
    try {
      let endpoint: string;
      const params: any = {};

      if (catId) {
        endpoint = '/api/interface/list_cat';
        params.catid = catId;
      } else {
        endpoint = '/api/interface/list';
        params.project_id = projectId;
      }

      // 优先使用传入的 token，其次使用实例的 token
      const finalToken = token || this.token;
      if (finalToken) {
        params.token = finalToken;
      }

      const response = await this.client.get(endpoint, { params });

      if (response.data.errcode !== 0) {
        throw new Error(response.data.errmsg || '获取接口列表失败');
      }

      return response.data.data || [];
    } catch (error) {
      this.handleError(error, '获取接口列表失败');
    }
  }

  /**
   * 搜索接口
   */
  async searchInterface(projectId: string, keyword: string, token?: string): Promise<any[]> {
    try {
      const params: any = {
        project_id: projectId,
        q: keyword,
      };

      // 优先使用传入的 token，其次使用实例的 token
      const finalToken = token || this.token;
      if (finalToken) {
        params.token = finalToken;
      }

      const response = await this.client.get('/api/interface/search', { params });

      if (response.data.errcode !== 0) {
        throw new Error(response.data.errmsg || '搜索接口失败');
      }

      return response.data.data || [];
    } catch (error) {
      this.handleError(error, '搜索接口失败');
    }
  }

  /**
   * 统一错误处理
   */
  private handleError(error: unknown, context: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const message = axiosError.response?.data 
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;
      throw new Error(`${context}: ${message}`);
    }
    throw new Error(`${context}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 工具类:格式化接口详情
 */
class InterfaceFormatter {
  /**
   * 格式化接口详情为结构化数据
   */
  static formatInterfaceDetails(interfaceData: any): any {
    const requestParams = this.extractRequestParams(interfaceData);
    const responseInfo = this.extractResponseInfo(interfaceData);

    return {
      id: interfaceData._id,
      title: interfaceData.title,
      method: interfaceData.method,
      path: interfaceData.path,
      description: interfaceData.desc || '',
      status: interfaceData.status || 'undone',
      request: {
        params: requestParams,
        headers: this.extractHeaders(interfaceData),
        body: this.extractRequestBody(interfaceData),
      },
      response: responseInfo,
      markdown: interfaceData.markdown || '',
      project_id: interfaceData.project_id,
      catid: interfaceData.catid,
      uid: interfaceData.uid,
      add_time: interfaceData.add_time,
      up_time: interfaceData.up_time,
    };
  }

  /**
   * 提取请求参数
   */
  private static extractRequestParams(interfaceData: any): any[] {
    const params: any[] = [];

    // Query参数
  if (interfaceData.req_query && Array.isArray(interfaceData.req_query)) {
    interfaceData.req_query.forEach((param: any) => {
        params.push({
        name: param.name,
          location: 'query',
        required: param.required === '1',
        description: param.desc || '',
          example: param.example || '',
        });
      });
    }

    // Path参数
    if (interfaceData.req_params && Array.isArray(interfaceData.req_params)) {
      interfaceData.req_params.forEach((param: any) => {
        params.push({
          name: param.name,
          location: 'path',
          required: true,
          description: param.desc || '',
          example: param.example || '',
      });
    });
  }
  
    return params;
  }

  /**
   * 提取请求头
   */
  private static extractHeaders(interfaceData: any): any[] {
    const headers: any[] = [];

  if (interfaceData.req_headers && Array.isArray(interfaceData.req_headers)) {
    interfaceData.req_headers.forEach((header: any) => {
        headers.push({
        name: header.name,
          value: header.value || '',
        required: header.required === '1',
        description: header.desc || '',
          example: header.example || '',
        });
      });
    }

    return headers;
  }

  /**
   * 提取请求体
   */
  private static extractRequestBody(interfaceData: any): any {
    const body: any = {
      type: interfaceData.req_body_type || 'none',
    };

    // JSON格式请求体
    if (interfaceData.req_body_type === 'json' && interfaceData.req_body_other) {
      try {
        body.schema = JSON.parse(interfaceData.req_body_other);
    } catch (e) {
        body.schema = interfaceData.req_body_other;
      }
    }

    // form格式请求体
    if (interfaceData.req_body_type === 'form' && interfaceData.req_body_form) {
      body.form = interfaceData.req_body_form;
    }

    return body;
  }

  /**
   * 提取响应信息
   */
  private static extractResponseInfo(interfaceData: any): any {
    const response: any = {
      type: interfaceData.res_body_type || 'json',
    };

    // JSON格式响应
    if (interfaceData.res_body_type === 'json' && interfaceData.res_body) {
      try {
        response.example = JSON.parse(interfaceData.res_body);
      } catch (e) {
        response.example = interfaceData.res_body;
      }
    }

    // 响应体JSON Schema
    if (interfaceData.res_body_other) {
      try {
        response.schema = JSON.parse(interfaceData.res_body_other);
      } catch (e) {
        response.schema = interfaceData.res_body_other;
      }
    }

    return response;
  }
}

/**
 * 工具类:解析 YApi URL
 */
class YApiUrlParser {
  /**
   * 从 YApi URL 中提取信息
   * 支持格式: https://yapi.example.com/project/100/interface/api/12345
   */
  static parseInterfaceUrl(url: string): { baseUrl: string; projectId: string; interfaceId: string } | null {
    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      // 匹配路径: /project/{projectId}/interface/api/{interfaceId}
      const match = urlObj.pathname.match(/\/project\/(\d+)\/interface\/api\/(\d+)/);
      
      if (match) {
        return {
          baseUrl,
          projectId: match[1],
          interfaceId: match[2],
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}

/**
 * 创建并配置MCP服务器
 */
async function createServer(): Promise<void> {
  // 初始化YApi客户端
  const yapiClient = new YApiClient();

  // 创建MCP服务器实例
  const server = new McpServer(
    {
      name: 'mcp-yapi-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
      instructions: `这是一个YApi集成服务器,提供以下功能:
1. 通过URL查询接口 (yapi_get_interface_by_url) - 推荐!直接粘贴YApi链接
2. 查询YApi接口详情 (yapi_get_interface)
3. 查询YApi项目信息 (yapi_get_project)
4. 查询接口列表 (yapi_list_interfaces)
5. 搜索接口 (yapi_search_interface)

使用前请设置环境变量:
- YAPI_BASE_URL: YApi服务器地址 (例如: https://yapi.example.com)
- YAPI_TOKEN: YApi访问令牌 (可选,用于访问私有项目)

推荐用法: 直接粘贴YApi接口链接,如: https://yapi.example.com/project/100/interface/api/12345`,
    }
  );

  // 注册工具0: 通过URL获取接口详情 (推荐)
  server.registerTool(
    'yapi_get_interface_by_url',
    {
      description: '通过YApi接口URL获取详细信息。支持直接粘贴YApi链接,如: https://yapi.example.com/project/100/interface/api/12345',
            inputSchema: {
        url: z.string().describe('YApi接口完整URL,例如: https://yapi.example.com/project/100/interface/api/12345'),
        token: z.string().optional().describe('访问令牌(可选,用于访问私有项目)'),
      },
    },
    async (args: { url: string; token?: string }) => {
      try {
        // 解析URL
        const parsed = YApiUrlParser.parseInterfaceUrl(args.url);
        
        if (!parsed) {
          return {
            content: [
              {
                type: 'text',
                text: '错误: 无法解析YApi URL。请确保URL格式正确,例如: https://yapi.example.com/project/100/interface/api/12345',
              },
            ],
            isError: true,
          };
        }

        // 临时切换到URL中的baseUrl
        const originalBaseUrl = yapiClient['baseUrl'];
        yapiClient['baseUrl'] = parsed.baseUrl;
        yapiClient['client'].defaults.baseURL = parsed.baseUrl;

        try {
          const interfaceData = await yapiClient.getInterfaceDetails(
            parsed.interfaceId,
            args.token
          );
          const formatted = InterfaceFormatter.formatInterfaceDetails(interfaceData);

          // 添加URL信息
          const result = {
            ...formatted,
            source_url: args.url,
            yapi_server: parsed.baseUrl,
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } finally {
          // 恢复原始baseUrl
          yapiClient['baseUrl'] = originalBaseUrl;
          yapiClient['client'].defaults.baseURL = originalBaseUrl;
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 注册工具1: 获取接口详情
  server.registerTool(
    'yapi_get_interface',
    {
      description: '获取YApi接口的详细信息,包括请求参数、响应参数、请求示例等',
            inputSchema: {
        interface_id: z.string().describe('YApi接口ID'),
        token: z.string().optional().describe('访问令牌(可选,用于访问私有项目)'),
      },
    },
    async (args: { interface_id: string; token?: string }) => {
      try {
        const interfaceData = await yapiClient.getInterfaceDetails(
          args.interface_id,
          args.token
        );
        const formatted = InterfaceFormatter.formatInterfaceDetails(interfaceData);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(formatted, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 注册工具2: 获取项目信息
  server.registerTool(
    'yapi_get_project',
    {
      description: '获取YApi项目的基本信息,包括项目名称、描述、成员等',
      inputSchema: {
        project_id: z.string().describe('YApi项目ID'),
        token: z.string().optional().describe('访问令牌(可选)'),
      },
    },
    async (args: { project_id: string; token?: string }) => {
      try {
        const projectInfo = await yapiClient.getProjectInfo(
          args.project_id,
          args.token
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projectInfo, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 注册工具3: 获取接口列表
  server.registerTool(
    'yapi_list_interfaces',
    {
      description: '获取YApi项目或分类下的接口列表',
      inputSchema: {
        project_id: z.string().describe('YApi项目ID'),
        cat_id: z.string().optional().describe('分类ID(可选)'),
        token: z.string().optional().describe('访问令牌(可选)'),
      },
    },
    async (args: { project_id: string; cat_id?: string; token?: string }) => {
      try {
        const interfaces = await yapiClient.getInterfaceList(
          args.project_id,
          args.cat_id,
          args.token
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(interfaces, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 注册工具4: 搜索接口
  server.registerTool(
    'yapi_search_interface',
    {
      description: '在YApi项目中搜索接口,支持按接口名称、路径搜索',
      inputSchema: {
        project_id: z.string().describe('YApi项目ID'),
        keyword: z.string().describe('搜索关键词'),
        token: z.string().optional().describe('访问令牌(可选)'),
      },
    },
    async (args: { project_id: string; keyword: string; token?: string }) => {
      try {
        const results = await yapiClient.searchInterface(
          args.project_id,
          args.keyword,
          args.token
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // 创建stdio传输层
  const transport = new StdioServerTransport();

  // 连接服务器到传输层
  await server.connect(transport);

  // 输出调试信息到stderr(不影响stdio通信)
  console.error('MCP YApi Server 已启动');
  console.error(`YApi Base URL: ${process.env.YAPI_BASE_URL || '未设置(将使用默认值)'}`);
  console.error(`YApi Token: ${process.env.YAPI_TOKEN ? '已设置' : '未设置'}`);
  console.error('服务器准备接收请求...');
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  try {
    await createServer();
  } catch (error) {
    console.error('启动服务器失败:', error);
    console.error('错误详情:', error instanceof Error ? error.stack : error);
    process.exit(1);
  }
}

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 运行服务器
main();
