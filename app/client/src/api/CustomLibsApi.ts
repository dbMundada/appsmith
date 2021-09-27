import { AxiosPromise } from "axios";
import Api from "./Api";
import { ApiResponse } from "./ApiResponses";

export type CDNJSLibrary = {
  description: string;
  version: string;
  homepage: string;
  latest: string;
  name: string;
};

export default class CustomLibsApi extends Api {
  private static baseURL = "/v1/customJSLib/";
  private static cdnJSBaseUrl = "https://api.cdnjs.com";
  private static cdnJSSearchUrl = `${CustomLibsApi.cdnJSBaseUrl}/libraries?fields=filename,description,version,homepage&limit=10`;
  private static buildSearchUrl = (query: string): string =>
    `${CustomLibsApi.cdnJSSearchUrl}${query ? `&search=${query}` : ""}`;
  public static searchLibrary(query: string): AxiosPromise<CDNJSLibrary[]> {
    return Api.get(CustomLibsApi.buildSearchUrl(query));
  }
  static fetchAppLibraries(applicationId: string): AxiosPromise<ApiResponse> {
    return Api.get(
      CustomLibsApi.baseURL + applicationId + "?type=applicationId",
    );
  }
  static installLibrary(
    applicationId: string,
    lib: any,
  ): AxiosPromise<ApiResponse> {
    return Api.post(CustomLibsApi.baseURL, {
      applicationId,
      ...lib,
    });
  }
  static uninstallLibrary(lib: any): AxiosPromise<ApiResponse> {
    return Api.delete(`${CustomLibsApi.baseURL}${lib.id}`);
  }
}