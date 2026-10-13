#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Petit serveur local pour travailler sur le site.

    python outils/serveur.py            -> http://localhost:8765
    python outils/serveur.py 3000       -> autre port

Pourquoi celui-ci plutot que « python -m http.server »
------------------------------------------------------
Le serveur integre de Python n'envoie aucun en-tete de cache. Le
navigateur garde alors les anciens fichiers en memoire et continue de les
executer apres une modification : on croit que le changement n'a pas
fonctionne, alors qu'il n'a simplement pas ete recharge.

Celui-ci interdit toute mise en cache. Une simple actualisation suffit,
plus besoin de Ctrl+F5.

Il sert aussi le bon type MIME pour les .webp, que les vieilles versions
de Python ne connaissent pas toujours.

Pour arreter : Ctrl+C.
"""

import functools
import http.server
import pathlib
import socketserver
import sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
PORT_DEFAUT = 8765


class Handler(http.server.SimpleHTTPRequestHandler):

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp",
        ".js":   "text/javascript",
        ".mjs":  "text/javascript",
        ".css":  "text/css",
        ".json": "application/json",
        ".svg":  "image/svg+xml",
    }

    def end_headers(self):
        # Rien ne doit etre garde en cache pendant qu'on travaille.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    # SimpleHTTPRequestHandler repond "304 Not Modified" a partir de
    # l'en-tete If-Modified-Since envoye par le navigateur, quels que
    # soient les en-tetes Cache-Control ci-dessus : le navigateur continue
    # alors d'utiliser sa copie en memoire. On retire cet en-tete de la
    # requete avant qu'il ne soit examine, pour forcer un 200 a chaque fois.
    def parse_request(self):
        ok = super().parse_request()
        if ok:
            del self.headers["If-Modified-Since"]
            del self.headers["If-None-Match"]
        return ok

    def log_message(self, fmt, *args):
        # Une ligne par requete, sans le bruit habituel.
        code = args[1] if len(args) > 1 else ""
        if str(code).startswith(("4", "5")):
            sys.stderr.write(f"  {code}  {args[0]}\n")


def main():
    port = PORT_DEFAUT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            sys.exit("Le port doit etre un nombre.")

    handler = functools.partial(Handler, directory=str(RACINE))
    # Un serveur mono-thread traite une requete a la fois : le
    # telechargement du livre PDF (une centaine de Mo) bloquerait alors
    # tout le reste du site jusqu'a la fin du transfert. Chaque requete a
    # donc son propre thread.
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True

    try:
        with socketserver.ThreadingTCPServer(("", port), handler) as httpd:
            print(f"Site servi sur http://localhost:{port}")
            print(f"Dossier : {RACINE}")
            print("Cache desactive — une actualisation normale suffit.")
            print("Ctrl+C pour arreter.")
            httpd.serve_forever()
    except OSError as e:
        sys.exit(f"Impossible d'ouvrir le port {port} : {e}\n"
                 f"Essayer un autre port : python outils/serveur.py 3000")
    except KeyboardInterrupt:
        print("\nArrete.")


if __name__ == "__main__":
    main()
