// src/hooks/useFollows.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export async function followUser(followerId, followingId) {
  return await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
}

export async function unfollowUser(followerId, followingId) {
  return await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
}

export function useIsFollowing(followerId, followingId) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!followerId || !followingId) return;
    supabase
      .from("follows")
      .select("*")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .maybeSingle()
      .then(({ data }) => setIsFollowing(!!data));
  }, [followerId, followingId]);

  return { isFollowing, setIsFollowing };
}

export function useFollowing(userId) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("follows")
      .select(
        "following_id, users!follows_following_id_fkey(id, username, avatar_url)",
      )
      .eq("follower_id", userId)
      .then(({ data }) => {
        setFollowing(data?.map((f) => f.users) || []);
        setLoading(false);
      });
  }, [userId]);

  return { following, loading };
}
