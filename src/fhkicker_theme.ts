
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const fhkicker_theme: CustomThemeConfig = {
	name: 'fhkicker_theme',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #0ed0b4 
		"--color-primary-50": "219 248 244", // #dbf8f4
		"--color-primary-100": "207 246 240", // #cff6f0
		"--color-primary-200": "195 243 236", // #c3f3ec
		"--color-primary-300": "159 236 225", // #9fece1
		"--color-primary-400": "86 222 203", // #56decb
		"--color-primary-500": "14 208 180", // #0ed0b4
		"--color-primary-600": "13 187 162", // #0dbba2
		"--color-primary-700": "11 156 135", // #0b9c87
		"--color-primary-800": "8 125 108", // #087d6c
		"--color-primary-900": "7 102 88", // #076658
		// secondary | #d3abe8 
		"--color-secondary-50": "248 242 252", // #f8f2fc
		"--color-secondary-100": "246 238 250", // #f6eefa
		"--color-secondary-200": "244 234 249", // #f4eaf9
		"--color-secondary-300": "237 221 246", // #edddf6
		"--color-secondary-400": "224 196 239", // #e0c4ef
		"--color-secondary-500": "211 171 232", // #d3abe8
		"--color-secondary-600": "190 154 209", // #be9ad1
		"--color-secondary-700": "158 128 174", // #9e80ae
		"--color-secondary-800": "127 103 139", // #7f678b
		"--color-secondary-900": "103 84 114", // #675472
		// tertiary | #d0c91d 
		"--color-tertiary-50": "248 247 221", // #f8f7dd
		"--color-tertiary-100": "246 244 210", // #f6f4d2
		"--color-tertiary-200": "243 242 199", // #f3f2c7
		"--color-tertiary-300": "236 233 165", // #ece9a5
		"--color-tertiary-400": "222 217 97", // #ded961
		"--color-tertiary-500": "208 201 29", // #d0c91d
		"--color-tertiary-600": "187 181 26", // #bbb51a
		"--color-tertiary-700": "156 151 22", // #9c9716
		"--color-tertiary-800": "125 121 17", // #7d7911
		"--color-tertiary-900": "102 98 14", // #66620e
		// success | #4a4e68 
		"--color-success-50": "228 228 232", // #e4e4e8
		"--color-success-100": "219 220 225", // #dbdce1
		"--color-success-200": "210 211 217", // #d2d3d9
		"--color-success-300": "183 184 195", // #b7b8c3
		"--color-success-400": "128 131 149", // #808395
		"--color-success-500": "74 78 104", // #4a4e68
		"--color-success-600": "67 70 94", // #43465e
		"--color-success-700": "56 59 78", // #383b4e
		"--color-success-800": "44 47 62", // #2c2f3e
		"--color-success-900": "36 38 51", // #242633
		// warning | #18dab2 
		"--color-warning-50": "220 249 243", // #dcf9f3
		"--color-warning-100": "209 248 240", // #d1f8f0
		"--color-warning-200": "197 246 236", // #c5f6ec
		"--color-warning-300": "163 240 224", // #a3f0e0
		"--color-warning-400": "93 229 201", // #5de5c9
		"--color-warning-500": "24 218 178", // #18dab2
		"--color-warning-600": "22 196 160", // #16c4a0
		"--color-warning-700": "18 164 134", // #12a486
		"--color-warning-800": "14 131 107", // #0e836b
		"--color-warning-900": "12 107 87", // #0c6b57
		// error | #665084 
		"--color-error-50": "232 229 237", // #e8e5ed
		"--color-error-100": "224 220 230", // #e0dce6
		"--color-error-200": "217 211 224", // #d9d3e0
		"--color-error-300": "194 185 206", // #c2b9ce
		"--color-error-400": "148 133 169", // #9485a9
		"--color-error-500": "102 80 132", // #665084
		"--color-error-600": "92 72 119", // #5c4877
		"--color-error-700": "77 60 99", // #4d3c63
		"--color-error-800": "61 48 79", // #3d304f
		"--color-error-900": "50 39 65", // #322741
		// surface | #236d6a 
		"--color-surface-50": "222 233 233", // #dee9e9
		"--color-surface-100": "211 226 225", // #d3e2e1
		"--color-surface-200": "200 219 218", // #c8dbda
		"--color-surface-300": "167 197 195", // #a7c5c3
		"--color-surface-400": "101 153 151", // #659997
		"--color-surface-500": "35 109 106", // #236d6a
		"--color-surface-600": "32 98 95", // #20625f
		"--color-surface-700": "26 82 80", // #1a5250
		"--color-surface-800": "21 65 64", // #154140
		"--color-surface-900": "17 53 52", // #113534

	}
}