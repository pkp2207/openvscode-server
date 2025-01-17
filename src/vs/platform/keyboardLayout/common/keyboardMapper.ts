/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Keybinding, ResolvedKeybinding, UserKeybinding } from 'vs/base/common/keybindings';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';

export interface IKeyboardMapper {
	dumpDebugInfo(): string;
	resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
	resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
	resolveUserBinding(keybinding: UserKeybinding): ResolvedKeybinding[];
}

export class CachedKeyboardMapper implements IKeyboardMapper {

	private _actual: IKeyboardMapper;
	private _cache: Map<string, ResolvedKeybinding[]>;
	private _userBindingCache: Map<string, ResolvedKeybinding[]>;

	constructor(actual: IKeyboardMapper) {
		this._actual = actual;
		this._cache = new Map<string, ResolvedKeybinding[]>();
		this._userBindingCache = new Map<string, ResolvedKeybinding[]>();
	}

	public dumpDebugInfo(): string {
		return this._actual.dumpDebugInfo();
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		const hashCode = keybinding.getHashCode();
		const resolved = this._cache.get(hashCode);
		if (!resolved) {
			const r = this._actual.resolveKeybinding(keybinding);
			this._cache.set(hashCode, r);
			return r;
		}
		return resolved;
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		return this._actual.resolveKeyboardEvent(keyboardEvent);
	}

	public resolveUserBinding(keybinding: UserKeybinding): ResolvedKeybinding[] {
		const hashCode = keybinding.getHashCode();
		const resolved = this._userBindingCache.get(hashCode);
		if (!resolved) {
			const r = this._actual.resolveUserBinding(keybinding);
			this._userBindingCache.set(hashCode, r);
			return r;
		}
		return resolved;
	}
}
