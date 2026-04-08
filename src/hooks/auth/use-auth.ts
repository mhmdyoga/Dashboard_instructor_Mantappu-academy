/* eslint-disable @typescript-eslint/no-explicit-any */
import { authServices } from "@/src/package/utilities/services/auth/authServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "@/src/package/schema/auth/authSchema";
import { toast } from "sonner";
import { useAuthStore } from "@/src/store/authStore";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient()
  const token = Cookies.get("accessToken");
  const { user, setUser, clearUser, isAuthenticated } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await authServices.me();
      const userData = (res as any).data.user ?? (res as any).user;
      setUser(userData);
      return res ?? null;
    },
    enabled: !!token,
    staleTime: 60 * 60 * 1000, // 1H,
    gcTime: 60 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const RegisterMutation = useMutation({
    mutationFn: (payload: RegisterSchemaType) => authServices.register(payload),
    onSuccess: ({ data }) => {
      toast.success("Register berhasil!, Mantappu Jiwwaaaaa!");
      router.push("/sign-in");
      return data;
    },
    onError: (err) => {
      const msg = err.message || "Login Gagal";
      toast.error(msg);
    },
  });

  const LoginMutation = useMutation({
    mutationFn: (payload: LoginSchemaType) => authServices.login(payload),
    onSuccess({ data }) {
      toast.success("Login Berhasil!, Mantappu Jiwwaaaa");
      setUser(data.user);
      router.push("/");
      return data;
    },
    onError: (err) => {
      const msg = err.message || "Login Gagal";
      toast.error(msg);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authServices.logout(),
    onSuccess: () => {
      queryClient.clear()
      toast.success("Logout Berhasil");
      clearUser();
      router.push("/sign-in");
    },
    onError: (err) => {
      const msg = err.message || "Logout Gagal";
      toast.error(msg);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated,
    login: LoginMutation,
    register: RegisterMutation,
    logout: logoutMutation,
    isRegistering: RegisterMutation.isPending,
    isLogginIn: LoginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
