_mapping_cache = {}


def make_cache_key(source_system: str, code: str, target: str, top_k: int):
    return f"{(source_system or '').lower()}::{(code or '').upper()}::{(target or '').lower()}::{int(top_k)}"


def get_cached_mapping(cache_key: str):
    return _mapping_cache.get(cache_key)


def set_cached_mapping(cache_key: str, value):
    _mapping_cache[cache_key] = value