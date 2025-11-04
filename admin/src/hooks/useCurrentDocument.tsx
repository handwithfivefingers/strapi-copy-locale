import { useFetchClient } from '@strapi/strapi/admin';
import { useState } from 'react';

interface IProps {
  type: string;
  uid: string;
  id?: string;
}

interface IData {
  data: unknown;
  meta: { availableLocales: { locale: string }[]; availableStatus: unknown[] };
}

interface SuccessResponse<T> {
  status: T;
  error: null;
}
interface ErrorResponse<T> {
  error: unknown | Error;
  status: T;
}

type Response<Status> = Status extends true ? SuccessResponse<Status> : ErrorResponse<Status>;

export const useCurrentDocument = (props: IProps) => {
  const [loading, setLoading] = useState(false);
  const fetch = useFetchClient();
  const getDocument = async () => {
    try {
      setLoading(true);
      const { data: response } = await fetch.get<IData>(
        `/content-manager/${props.type}/${props.uid}`
      );
      console.log('response', response);
      if (response) {
        return response;
      }
    } catch (error) {
      console.log('failed to load locale', error);
    } finally {
      setLoading(false);
    }
  };

  const createPublishDocument = async (params: any) => {
    try {
      await fetch.post(
        `/content-manager/${props.type}/${props.uid}/${props.id}/actions/publish?locale=${params.locale}`,
        {
          ...params,
        }
      );
      const resp = { status: true, error: null } as Response<true>;
      return resp;
    } catch (error) {
      const resp = { status: false, error } as Response<false>;
      return resp;
    }
  };
  const createDraftDocument = async (params: any) => {
    try {
      await fetch.put(`/content-manager/${props.type}/${props.uid}?locale=${params.locale}`, {
        ...params,
      });
      const resp = { status: true, error: null } as Response<true>;
      return resp;
    } catch (error) {
      const resp = { status: false, error } as Response<false>;
      return resp;
    }
  };

  return {
    createPublishDocument,
    createDraftDocument,
    getDocument,
    loading,
  };
};
