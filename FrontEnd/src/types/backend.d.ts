import { error } from "console"
import { url } from "inspector"
import { pages } from "next/dist/build/templates/app-page"
import { headers } from "next/headers"

export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
   interface IUser {
      _id?: string
      name: string
      email: string
      password?: string
      age: number
      gender: string
      address: string
      role?: {
         _id: string
         name: string
      }

      company?: {
         _id: string
         name: string
      }

      createdBy?: string
      isDeleted?: boolean
      deletedAt: boolean | null
      createdAt: string
      updatedAt: string
   }

   interface ICompany {
      _id?: string
      name: string
      logo: string
      address: string
      description: string

      createdBy?: string
      isDeleted?: boolean
      deletedAt?: boolean | null
      createdAt?: string
      updatedAt?: string
   }

   interface IJob {
      _id?: string
      name: string
      skills: string[]
      location: string
      description: string
      salary: number
      quantity: number
      level: string
      startDate: Date
      endDate: Date
      isActive: boolean

      company: {
         _id: string
         name: string
         logo?: string
      }

      createdBy?: string
      isDeleted?: boolean
      deletedAt?: boolean | null
      createdAt?: string
      updatedAt?: string
   }

   interface IResume {
      _id?: string
      name: string
      email: string
      userId: string
      url: string
      status: string
      companyId: string | {
         _id: string
         name: string
         logo: string
      }

      jobId: string | {
         _id: string
         name: string
      }

      history?: {
         status: string
         updatedAt: Date
         updateBy: {
            _id: string
            email: string
         }
      }[]

      createdBy?: string
      isDeleted?: boolean
      deletedAt?: boolean | null
      createdAt?: string
      updatedAt?: string
   }

   interface IPermission {
      _id?: string
      name: string
      apiPath?: string
      method?: string
      module?: string

      createdBy?: string
      isDeleted?: boolean
      deletedAt?: boolean | null
      createdAt?: string
      updatedAt?: string
   }

   interface IRole {
      _id?: string
      name: string
      description: string
      isActive: boolean
      permissions: IPermission[] | string[]

      createdBy?: string
      isDeleted?: boolean
      deletedAt?: boolean | null
      createdAt?: string
      updatedAt?: string
   }

   interface IRequest {
      url: string;
      method: string;
      body?: { [key: string]: any };
      queryParams?: any;
      useCredentials?: boolean;
      headers?: any;
      nextOption?: any;
   }

   interface IBackendRes<T> {
      error?: string | string[];
      message: string;
      statusCode: number | string;
      data?: T;
   }

   interface IModelPaginate<T> {
      meta: {
         current: number;
         pageSize: number;
         pages: number;
         total: number;
      },
      result: T[]
   }

}

